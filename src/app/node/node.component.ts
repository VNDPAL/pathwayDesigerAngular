import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NodeModel } from '../node-model';
import { NodeService } from '../node.service';

export interface Node {
  id: string;
  top?: number;
  left?: number;
  name?:string;
}

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})



export class NodeComponent implements AfterViewInit {

  @Input()
  node!: Node;

  isPopUp:Boolean = false;
  nodeName:string | undefined = '';
  tempNode : any;

  @Input() jsPlumbInstance: any;
  
  constructor(private nodeService: NodeService) { }
  
  exampleDropOptions = {
    tolerance: 'touch',
    hoverClass: 'dropHover',
    activeClass: 'dragActive'
  };

  Endpoint1 = {
    endpoint: ['Rectangle', { width : 10,height:10 }],
    paintStyle: { fill: '#99cb3a' },
    isSource: true,
    scope: 'jsPlumb_DefaultScope',
    connectorStyle: { stroke: '#99cb3a', strokeWidth: 3 },
    connector: ['Flowchart', { curviness: 63 }],
    maxConnections: 1,
    isTarget: false,
    connectorOverlays: [['Arrow', { location: 1 }]],
    dropOptions: this.exampleDropOptions
  };
  Endpoint2 = {
    endpoint: ['Rectangle', { width : 10,height:10 }],
    paintStyle: { fill: '#ffcb3a' },
    isSource: false,
    scope: 'jsPlumb_DefaultScope',
    maxConnections: 1,
    isTarget: true,
    dropOptions: this.exampleDropOptions
  };

  ngAfterViewInit() {
   
    const { id } = this.node;
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'TopRight', uuid: id + '_topRight' }, this.Endpoint1);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'BottomRight', uuid: id + '_bottomRight' }, this.Endpoint1);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'BottomLeft', uuid: id + '_bottomLeft' }, this.Endpoint1);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'TopLeft', uuid: id + '_topLeft' }, this.Endpoint1);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Top', uuid: id + '_top' }, this.Endpoint2);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Right', uuid: id + '_right' }, this.Endpoint2);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Bottom', uuid: id + '_bottom' }, this.Endpoint2);
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Left', uuid: id + '_left' }, this.Endpoint2);
    this.jsPlumbInstance.draggable(id,{
      start: (event:any)=>{this.onDragStart(event)},
      drag: (event: any)=>{},
      stop: (event: any,ui:any)=>{this.onDragStop(event)}
    });
  }

  onDragStart(event:any){
    this.tempNode = this.node;
    console.log(this.node.name)
  }

  onDragStop(event:any){
    console.log(event);

    if(this.tempNode.left > 307)
    {
        return;
    }

    if(event.pos[0] < 307)
    {
      this.removeNode(this.node);
    }
   
      const model : NodeModel = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:this.tempNode.name,left:this.tempNode.left,top:this.tempNode.top }
      this.node.left = event.pos[0];
      this.node.top = event.pos[1];
      this.nodeService.changeMessage(model);
    
  }

  removeNode(node: any) {
    this.jsPlumbInstance.removeAllEndpoints(node.id);
    this.jsPlumbInstance.remove(node.id);
  }

  editNode(node: any) {
    this.isPopUp = true;
    this.nodeName = this.node.name;
  }

  submitPopUp(){
    this.node.name = this.nodeName;
    // if (node.type === 'end') {
    //   this.jsPlumbInstance.deleteEndpoint(node.id + 'right');
    // } else {
    //   this.jsPlumbInstance.addEndpoint(this.node.id,
    //     { anchor: 'Right', uuid: this.node.id + 'right' }, this.Endpoint1);
    // }
    this.isPopUp = false;
  }

  onPopUpClose(){
    this.isPopUp = false;
  }

}
