var group = document.querySelector(".lng-change");
    var nodes = document.querySelectorAll(".lng-button");
    var total = nodes.length;
    var ease  = Power1.easeInOut;
    var boxes = [];

    for (var i = 0; i < total; i++) {
        
    var node = nodes[i];
    
    // Initialize transforms on node
    TweenLite.set(node, { x: 0 });
    
    boxes[i] = {
        transform: node._gsTransform,
        x: node.offsetLeft,
        y: node.offsetTop,
        node    
    };
    } 

    group.addEventListener("mouseenter", layout);
    group.addEventListener("mouseleave", layout);

    function layout() {

    group.classList.toggle("reorder");  
    
    for (var i = 0; i < total; i++) {
        
        var box = boxes[i];
            
        var lastX = box.x;
        var lastY = box.y;   
        
        box.x = box.node.offsetLeft;
        box.y = box.node.offsetTop;
        
        // Continue if box hasn't moved
        if (lastX === box.x && lastY === box.y) continue;
        
        // Reversed delta values taking into account current transforms
        var x = box.transform.x + lastX - box.x;
        var y = box.transform.y + lastY - box.y;  
        
        // Tween to 0 to remove the transforms
        TweenLite.fromTo(box.node, 0.5, { x, y }, { x: 0, y: 0, ease });    
    } 
    }