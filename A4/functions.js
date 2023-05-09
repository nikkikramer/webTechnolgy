/*eslint-env browser*/
/* global $ */
  
function sortTable(theTable, n) {
    var rows, sorting, i, counter = 0, x, y, toSort, dir;
    theTable = document.getElementById('productstable');
    sorting = true;
    dir = "asc"; 
    
    while (sorting) {
      
        sorting = false;
        rows = theTable.rows;
 
        for (i = 2; i < (rows.length - 1); i++) {
        //start from row 2 such that input row stays at the top
            
            toSort = false;
            
            if(rows[i].id == "containsForm"|| rows[i+1].id=="containsForm"){
                break;
            }
            
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            
            var xVar = (isNaN(x.innerHTML)) ? x.innerHTML.toLowerCase() : parseFloat(x.innerHTML);
            var yVar = (isNaN(y.innerHTML)) ? y.innerHTML.toLowerCase() : parseFloat(y.innerHTML);

            if (dir == "desc") {
                if (xVar < yVar) {
                    
                    toSort = true;
                    break;
                }
            }
            
            else if (dir == "asc") {
                if (xVar > yVar) {
                   
                    toSort= true;
                    break;
                }
            }
        }
        if (toSort) {
            
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            sorting = true;
            counter ++;      
        } 
        else {
            
            if (counter == 0 && dir == "asc") {
                dir = "desc";
                sorting = true;
            }
        }
    }
}

//source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table

var headers = document.querySelectorAll(".change");
headers.forEach(function(elem) {
    elem.addEventListener("click", function(){
        var headerNumber = elem.id.split(" ");
        var theTable = headerNumber[0];
        var z = headerNumber[1];
        sortTable(theTable, z);
    });
});

function getItem() {
    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api22/33a096d5',
        method: 'get',
        dataType: 'json',
        success: function (response)
        {
            var trHTML = '';
            $.each(response, function(key,value) {
                   trHTML +=
                   '<tr><td>' + value.brand +
                   '</td><td>' + value.model +
                   '</td><td>' + value.os +
                   '</td><td>' + value.screensize +
                   '</td><td><img src="' + value.image +
                   '" width="80" length ="80"></td></tr>';
                   });
            $('#productstable').append(trHTML);
        }

    });
}

//source: https://stackoverflow.com/questions/31074532/using-jquery-to-build-table-rows-from-ajax-response-not-with-static-json-data


function makeTable(){
    $.getJSON("https://wt.ops.labs.vu.nl/api22/33a096d5", function(){
        getItem();
        })
    }

makeTable()

var form = document.getElementById("tableForm")
form.addEventListener('submit', function(e) {
    var i;
    e.preventDefault();
    var table = document.getElementById("productstable");
        var length = table.rows.length;

        for(i=length-1; i>1; i--) {
            table.deleteRow(i);
        }
    $.ajax({
        type: "POST",
        url: "https://wt.ops.labs.vu.nl/api22/33a096d5",
        data: $(this).serialize(),
        success: function() {
            getItem();
        }
    });
});


 $("#resettable").click(function(){
    var i;
    $.get("https://wt.ops.labs.vu.nl/api22/33a096d5/reset", function(){
        var table = document.getElementById("productstable");
        var length = table.rows.length;
        
        for(i=length-1; i>1; i--) {
            table.deleteRow(i);
        }
        alert("The table has been reset.");
        });
        makeTable();
 });

window.onscroll = function() {stickNav()};
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickNav() {
    if(window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}


var toggleMenu = document.querySelector('.toggleMenu');
var navBarToggle = document.querySelector('.nav_links');

toggleMenu.addEventListener('click', function() {
    navBarToggle.classList.toggle('active');
})


