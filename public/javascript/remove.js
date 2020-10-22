function deleteItem(id, amount, productID){
    console.log("THE JAVASCRIPT IS HERE MFs");
    console.log(id, amount, productID);
    
    // var toDelete = $("#"+id).val();
    
    $(document).ready(function(){
    
        $.ajax({
        method:   "GET",
        url:      "/userCartDelete/" + id + "/" + amount + "/" + productID, //userCartDelete/:id/:amount
        dataType: "json",
            success: function(result) {
                console.log(result);
                console.log("YES ITS EMPTY MFs");
                
                $("#"+id).html("<h5>Deleted<h5>");
                
            },
            error: function(err){
                console.log(err);
            }
        });
        
    });

}