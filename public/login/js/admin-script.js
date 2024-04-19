/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

// let allButtons = document.getElementsByClassName('inp');
//       for (let button of allButtons) {
//          button.addEventListener('click', (event) => {
//             var clickedElement = event.target
//             var clickedRow = clickedElement.parentNode.parentNode.id;
//             var rowData = document.getElementById(clickedRow).querySelectorAll('.columndata');
//             let Student_name = rowData[0].innerHTML;
//             let course = rowData[1].innerHTML;
//             let year = rowData[2].innerHTML; 
//             let output = document.getElementById('output');
//             output.innerHTML = "The submited row data are : <br>";
//             output.innerHTML += `name - ${Student_name}, course - ${course}, Graduation year - ${year}`;
//          });
//       }
$(".inp").click(function () {
    let $row = $(this).closest("tr");
    let $id = $row.find(".col1").text();
    let $status = $row.find(".col2").text();
    $.confirm({
        theme: 'modern',
        title: 'Block User?!',        
        content: 'Are you sure ?!',
        buttons: {
            
                confirm: function () {                    
                    const data={
                        id:$id,
                        status:$status
                    }
                    var self = this;
                    return $.ajax({
                        url: `http://localhost:3000/admin/block-user/`,
                        dataType: 'json',
                        method: 'post',
                        data:data
                    }).done(function (response) {                      
                        location.reload(true);
                    }).fail(function(){
                        self.setContent('Something went wrong.');
                    });
                
                
            },
            cancel: function () {
                
            },
        }
            
        
    });
    
 });