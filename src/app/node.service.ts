import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { BehaviorSubject } from 'rxjs';
import { NodeModel } from './node-model';
import { NodeComponent } from './node/node.component';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private rootViewContainer: any;

  jsPlumbInstance = jsPlumb.getInstance(); 
  private nodes: any[] = [];

  private messageSource = new BehaviorSubject<NodeModel | null>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private factoryResolver: ComponentFactoryResolver) { }

  public setRootViewContainerRef(viewContainerRef: any) {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicNode(node: any) {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    (<any>component.instance).node = node;
    (<any>component.instance).jsPlumbInstance = this.jsPlumbInstance;
    this.rootViewContainer.insert(component.hostView);
    console.log("in NodeService.." , component.instance );
    this.nodes.push(node);
  }

  changeMessage(NodeModel: NodeModel) {
    this.messageSource.next(NodeModel)
  }
 
  addConnection(connection: { uuids: any; }) {
    this.jsPlumbInstance.connect({ uuids: connection.uuids });
  }

  getAllNodes()
  {
    return this.nodes;
  }

  public clear() {
    this.rootViewContainer.clear();
  }
}
