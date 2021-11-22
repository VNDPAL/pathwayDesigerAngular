import { Component, OnInit, ViewChild } from '@angular/core';
import { NodeModel } from './node-model';
import { NodeService } from './node.service';
import { NodesContainerComponent } from './nodes-container/nodes-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'newJsPlumb';
  nodes = [];

  isPopUp:Boolean = false;
  pathwaySelected:any;
  pathways:any[] = [
    {
      name:'Pathway One'
    },
    {
      name:'Pathway Two'
    },
    {
      name:'Pathway Three'
    }
  ];

  connections = [];
  @ViewChild("nodeContainer") component1: NodesContainerComponent;



  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.fillFromJson();
    // this.addNode();
    this.nodeService.currentMessage.subscribe(model => 
      {
        if(model !== null)
        {
          this.addNewNode(model);
        }
      });
  }
  addNode() {
      const Rootnode = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'Root Node',top:15,left:756 };
      this.nodes.push(Rootnode as never);
      const node = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'New Node',top:23,left:84 };
      this.nodes.push(node as never);
      const node1 = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'Determination',top:340,left:76 };
      this.nodes.push(node1 as never);
      const node2 = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'Page',top:263,left:78 };
      this.nodes.push(node2 as never);
      const node3 = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'Pathway Link',top:184,left:80 };
      this.nodes.push(node3 as never);
      const node4 = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)],name:'Label',top:103,left:82 };
      this.nodes.push(node4 as never);
  }

  addNew(){
    this.component1.addNode();
  }

  addNewNode(model:NodeModel){
    this.component1.addNewNode(model);
  }
  
  OpenPathway(){
    this.isPopUp = true;
  }

  fillFromJson() {
    let json;
    if(localStorage.getItem('testPathwayPlumb'))
    {
      json = localStorage.getItem('testPathwayPlumb')!;
      const data = JSON.parse(json);

      this.nodes = data.nodes;
      this.connections = data.connections;
      localStorage.removeItem('testPathwayPlumb');
    }
    else
    {
      this.addNode();
    }
  }

  submitPopUp(){
    location.reload();
    // this.fillFromJson();
    // this.isPopUp = false;
  }

  openNewPathway(){
    const json = localStorage.getItem('test')!;
    const data = JSON.parse(json);

    this.nodes = data.nodes;
    this.connections = data.connections;
    this.isPopUp = false;
  }

  onPopUpClose(){
    this.isPopUp = false;
  }
}
