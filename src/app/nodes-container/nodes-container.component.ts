import { AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NodeModel } from '../node-model';
import { NodeService } from '../node.service';

@Component({
  selector: 'nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.css']
})
export class NodesContainerComponent implements OnInit,AfterViewInit {

  @Input() nodes = [];

  @Input() connections = [];

  @ViewChild('nodes', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  isPopUp:Boolean = false;

  nodeName:string | undefined = '';
  targetNode:any;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
   
  }  

  ngAfterViewInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);

    this.nodes.forEach(node => {
      this.nodeService.addDynamicNode(node);
    });
    
    setTimeout(() => {
      this.connections.forEach(connection => {
        this.nodeService.addConnection(connection);
      });
    })

    this.nodeService.jsPlumbInstance.bind('connection', info => {
        this.isPopUp = true;
        this.targetNode = this.nodes.find(node => node['id'] === info.targetId);
        this.nodeName = this.targetNode.name;
      
   });
}

submitPopUp(){
  if (this.targetNode) {
    this.targetNode.name = this.nodeName;
}
  this.isPopUp = false;
}

onPopUpClose(){
  this.isPopUp = false;
}

  addNode() {
    const node = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'new Node' };

    this.nodeService.addDynamicNode(node);
  }

  addNewNode(model:NodeModel) {
    const node = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:model.name,left:model.left,top:model.top };

    this.nodeService.addDynamicNode(node);
  }

  saveNodeJson(){
    //save element position on Canvas and node conections

    const container = this.viewContainerRef.element.nativeElement.parentNode;
    let nodes = Array.from(container.querySelectorAll('.node')).map((node: any) => {
      return {
        id: node.id,
        top: node.offsetTop,
        left: node.offsetLeft, 
      }
    });
    const a = this.nodeService.getAllNodes();
    nodes = nodes.map(x=>{
      const temp = a.find(y=>y['id']==x.id)!;
      return {...x,name:temp["name"]}
    })

    const connections = (this.nodeService.jsPlumbInstance.getAllConnections() as any[])
        .map((conn) => ({ uuids: conn.getUuids() }));

    const json = JSON.stringify({ nodes, connections });
    localStorage.setItem('testPathwayPlumb',json);
    console.log(json);
  }

}
