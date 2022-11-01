var drawThings = false;

var Wall='rgb(255, 255, 255)';
var original = 'rgb(243, 190, 190)';

var rows=10;
var cols=10;
var grid = new Array(rows);

function removeElement(arr,key){
  for(var i=arr.length-1;i>=0;i--){
    if(arr[i]==key){
      arr.splice(i,1);
    }
  }
}


function heuristic(a,b){
  //var d=dist(a.x,a.y,b.x,b.y);
  var d=abs(a.i-b.i)+abs(a.j-b.j);
  return d;
}



//Starting and ending points of the search
var start;
var end;
//Array that stores grid points that still needs to be visited
var openSet=[];

//Array that stores grid points that are already visited so that we dont visit them again
var closedSet=[];

var path=[];



function Spot(i,j){
  //Properties
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.neighbours=[];
  this.previous=undefined;

  this.wall = function(){
    if((this.i==0 && this.j==0) || (this.i==rows-1  && this.j==cols-1)){
      return false;
    }

    var nnode=document.getElementById("node"+((this.i*10)+(this.j+1)));
    if(nnode.style.backgroundColor == Wall){
      return true;
    }
    return false;
  }

  
  
/*
  for(var k=0;k<xarray.length;k++){
    if(xarray[k]==this.i && yarray[k]==this.j){
      this.wall=true;
    }
  }
*/

  this.addNeighbours=function(grid){
    if(i<rows-1){
      this.neighbours.push(grid[i+1][j]);
    }
    if(i>0){
      this.neighbours.push(grid[i-1][j]);
    }
    if(j<cols-1){
      this.neighbours.push(grid[i][j+1]);
    }
    if(j>0){
      this.neighbours.push(grid[i][j-1]);
    }
    if(i>0 && j>0){
      this.neighbours.push(grid[i-1][j-1]);
    }
    if(i<rows-1 && j<cols-1){
      this.neighbours.push(grid[i+1][j+1]);
    }
    if(i>0 && j<cols-1){
      this.neighbours.push(grid[i-1][j+1]);
    }
    if(i<rows-1 && j>0){
      this.neighbours.push(grid[i+1][j-1]);
    }
  }
}





function setup(){
    var maze_container=document.getElementById('maze_container');
    for(var i=0;i<10;i++){
        var row=document.createElement('div');

        row.className= "row row"+(i+1);

        row.id="row"+(i+1);
        for(var j=0;j<10;j++){

            var node=document.createElement('div');

            node.className="node node"+((i*10)+(j+1));

            node.id="node"+((i*10)+(j+1));
            if(((i*10)+(j+1))!=1 && ((i*10)+(j+1))!=100){
                node.style.backgroundColor=original;

                node.onclick=function(){
                    clicked(this.id);
                }
            }

            row.appendChild(node);
        }

        maze_container.appendChild(row);
    }

    for(var i=0;i<rows;i++){
      grid[i]=new Array(cols);
    }
  
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++){
        //New Spots to store the values or cost of that point on grid.
        grid[i][j]=new Spot(i,j);
      }
    }
  
    //Adding Neighbours
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++){
        grid[i][j].addNeighbours(grid);
      }
    }
    
    start=grid[0][0];
    end=grid[rows-1][cols-1];


    openSet.push(start);
}


function draw() {

  if(drawThings){

  if(openSet.length>0){
    //Implies still grid points need to be visited

    var lowestIndex=0;
    for(var i=0;i<openSet.length;i++){
      if(openSet[i].f<openSet[lowestIndex].f){
        lowestIndex=i;
      }
    }

    var current=openSet[lowestIndex];

    if(current === end){
      noLoop();
      document.querySelector("h2").style.visibility = 'visible';
    }

    removeElement(openSet,current);
    closedSet.push(current);


    //Some evaluations on neighbour before adding them into openset

    var neighbourOfCurrent=current.neighbours;

    for(var i=0;i<neighbourOfCurrent.length;i++){
      var neigh=neighbourOfCurrent[i];
      if(!closedSet.includes(neigh) && !neigh.wall()){
        var tempG=current.g+1;
        var newPath=false;
        if(openSet.includes(neigh)){
          if(tempG<neigh.g){
            newPath=true;
            neigh.g=tempG;
          }
        }
        else{
          neigh.g=tempG;
          newPath=true;
          openSet.push(neigh);
        }
        if(newPath){
          neigh.h=heuristic(neigh,end);
          neigh.f=neigh.g+neigh.h;

          //For keeping track that from where it came
          neigh.previous=current;
        }
        


      }
    }



  }
  else{
    //All grid points are been visited
    noLoop();
    document.querySelector("h2").textContent='Sorry !!! Path Does Not Exist!!!';
    document.querySelector("h2").style.visibility='visible';
    return;
  }





  //For Debugging
 

  //Finding the path
  path=[];
  var temp=current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp=temp.previous;
  }
  

  for(var i=0;i<path.length;i++){
      var node=document.getElementById("node"+(((path[i].i)*10)+((path[i].j)+1)));
      node.style.backgroundColor='rgb(92, 92, 92)';
  }
}
}
















function clicked(elementId){
    var node=document.getElementById(elementId);

    if(node.style.backgroundColor == Wall){
        node.style.backgroundColor=original;
    }
    else{
        node.style.backgroundColor = Wall;
    }
}

function reset(){
    for(var i=2;i<100;i++){
        var node=document.getElementById("node"+i);

        node.style.backgroundColor=original;
    }
    window.location.reload();
}


function toggle(){
  drawThings = !drawThings; 
}