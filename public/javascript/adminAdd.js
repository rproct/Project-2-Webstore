function addAmount(id){
    
    var amount = $("#thing"+id).val();
    var total1 = Number($("#li"+id).text());
    console.log("total1 is " + total1);
    
    console.log("the add JS IS HERE " + id + " and the amount is " + amount);
    if(amount > 0){
        $(document).ready(function(){
        
            $.ajax({
            method:   "GET",
            url:      "/adminAdd/" + id + "/" + amount, ///adminAdd/:id/:quantity
            dataType: "json",
                success: function(result) {
                    console.log(result);
                    console.log("YES ITS EMPTY MFs");
                    
                    $('#li'+id).html("<li>"+(Number(amount)+total1)+"<li>");
                    alert("The item has successfully updated");
                },
                error: function(err){
                    console.log(err);
                    alert("The item was not successfully updated, refer to an operator");
                }
            });
            
        });
    }
}

function subAmount(id){
    var amount = $("#thing"+id).val();

    console.log("the sub JS IS HERE " + id + " and the amount is " + amount);

    var total1 = Number($("#li"+id).text());
    console.log("the total is " + total1);
    
    if(amount > 0){
        $(document).ready(function(){
        
            $.ajax({
            method:   "GET",
            url:      "/adminSub/" + id + "/" + amount, ///adminAdd/:id/:quantity
            dataType: "json",
                success: function(result) {
                    console.log(result);
                    console.log("YES ITS EMPTY MFs");
                    
                    $('#li'+id).html("<li>"+(total1-Number(amount))+"<li>");
                    alert("The item has successfully updated");
                },
                error: function(err){
                    console.log(err);
                    alert("The item was not successfully updated, refer to an operator");
                }
            });
            
        });
    }
    
}