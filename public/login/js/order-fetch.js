let table = new DataTable("#showorders", {
  ajax: "http://localhost:3000/admin/orders/getorders",
  order: [[3, "desc"]],
  columns: [
    { data: "orderNumber" },
    {
      data: "orderDate",
      render: DataTable.render.datetime("DD MMM YYYY"),
    },
    { data: "orderStatus" },
    {
      data: "paymentType",
    },
    { data: "userId.name" },
    {
      data: "",
      render: (data, type, row) => {
        // console.log(row);
        return `<a href='/admin/orderDetailsPage/${row._id}'><button class='btn btn-primary'>Details</button></a>`;
      },
    },
  ],
});

table.on("click", "td.unlist-list", function (e) {
  //console.log($("#btn-unlist").text())
  e.preventDefault();

  let $row = $(this).closest("tr");
  let $id = $row.find(".col0").text();

  let status = false;

  $.confirm({
    title: "List or Unlist Product!",
    content: "Are You Sure!",
    buttons: {
      confirm: function () {
        if ($("#btn-unlist").text() == "Unlist") {
          status = true;
          $("#btn-unlist")
            .attr({ class: "btn btn-primary", id: "btn-list" })
            .text("List");
        }
        if ($("#btn-list").text() == "List") {
          status = false;
          $("#btn-list")
            .attr({ class: "btn btn-danger", id: "btn-unlist" })
            .text("Unlist");
        }
        const data = {
          id: $id,
          status: status,
        };

        // console.log(data)

        var self = this;
        return $.ajax({
          url: `http://localhost:3000/admin/products/del`,
          dataType: "json",
          method: "post",
          data: data,
        })
          .done(function (response) {
            console.log(response);

            /*
                    if(response.message == 'success'){
                        $.alert("Successfully Updated");  
                        
                    }else {
                        $.alert(response.message);  
                    }*/
            //$.alert("Successfully added : "+ response.message);
            // location.reload(true);
            //   table.row($row)
            //     .remove()
            //     .draw(true);
            //table.ajax.reload();
            table.ajax.url("http://localhost:3000/admin/products/get").load();
          })
          .fail(function () {
            self.setContent("Something went wrong.");
          });
      },
      cancel: function () {
        // $.alert('Canceled!');
      },
    },
  });
});

// table.on('click','td.unlist-list',(e)=>{
// })

// Delete a record
table.on("click", "td.editor-delete ", function (e) {
  e.preventDefault();
  let $row = $(this).closest("tr");
  let $id = $row.find(".col0").text();
  $.confirm({
    title: "Delete Catagory!",
    content: "Are You Sure!",
    buttons: {
      confirm: function () {
        const data = {
          id: $id,
        };

        var self = this;
        return $.ajax({
          url: `http://localhost:3000/admin/products/del`,
          dataType: "json",
          method: "post",
          data: data,
        })
          .done(function (response) {
            //$.alert("Successfully added : "+ response.message);
            // location.reload(true);
            table.row($row).remove().draw(true);
          })
          .fail(function () {
            self.setContent("Something went wrong.");
          });
      },
      cancel: function () {
        // $.alert('Canceled!');
      },
    },
  });
});

function addNewRow() {
  $.confirm({
    title: "Catagory!",
    content:
      "" +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      "<label>Enter the Catagory</label>" +
      '<input type="text" placeholder="Your name" class="name form-control" name="newcat" required />' +
      "</div>" +
      "</form>",
    buttons: {
      formSubmit: {
        text: "Submit",
        btnClass: "btn-blue",
        action: function () {
          var name = this.$content.find(".name").val();
          if (!name) {
            $.alert("provide a valid Catagory Name");

            return false;
          }

          // $.alert('Your name is ' + name);
          const data = {
            name,
            status: true,
          };
          var self = this;
          return $.ajax({
            url: `http://localhost:3000/admin/catagory/insertcat`,
            dataType: "json",
            method: "post",
            data: data,
          })
            .done(function (response) {
              // location.reload(true);
              table.row
                .add({ _id: response.id, name: name, status: true })
                .draw(true);
              //$.alert("Successfully added : "+ response.message);
            })
            .fail(function () {
              self.setContent("Something went wrong.");
            });
        },
      },
      cancel: function () {
        //close
      },
    },
    onContentReady: function () {
      // bind to events
      var jc = this;
      this.$content.find("form").on("submit", function (e) {
        // if the user submits the form by pressing enter in the field.
        e.preventDefault();
        jc.$$formSubmit.trigger("click"); // reference the button and click it
      });
    },
  });
}

function editrow(id) {
  // e.preventDefault()
  const data = {
    id,
  };
  $.ajax({
    url: `http://localhost:3000/admin/products/getprod`,
    dataType: "json",
    method: "GET",
    data: data,
  })
    .done(function (response) {
      //   $.alert(response.name)

      /*** form edit starts here */
      $.confirm({
        title: "Catagory!",
        content:
          "" +
          '<form action="" class="formName">' +
          '<div class="form-group">' +
          "<label>Enter the Catagory</label>" +
          '<input type="text" placeholder="Your name" class="name form-control" name="newcat" value="' +
          response.name +
          '" required />' +
          "</div>" +
          "</form>",
        buttons: {
          formSubmit: {
            text: "Submit",
            btnClass: "btn-blue",
            action: function () {
              var name = this.$content.find(".name").val();
              if (!name) {
                $.alert("provide a valid Catagory Name");

                return false;
              }

              // $.alert('Your name is ' + name);
              const data = {
                id,
                name,
                status: true,
              };
              var self = this;
              return $.ajax({
                url: `http://localhost:3000/admin/products/prodedt`,
                dataType: "json",
                method: "post",
                data: data,
              })
                .done(function (response) {
                  // location.reload(true);
                  // table.row
                  // .add({"_id":response.id,"name":name,status:true})
                  // .draw(true);
                  // $.alert("Successfully Updated : "+ response.message);
                  table.ajax.reload();
                })
                .fail(function () {
                  self.setContent("Something went wrong.");
                });
            },
          },
          cancel: function () {
            //close
          },
        },
        onContentReady: function () {
          // bind to events
          var jc = this;
          this.$content.find("form").on("submit", function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger("click"); // reference the button and click it
          });
        },
      });
      /*** form edit ends here */
    })
    .fail(function () {
      $.alert("Something went wrong.");
    });
}

// document.querySelector('#addcat').addEventListener('click', ()=>{
//     addNewRow();

// });

// Edit record
// table.on('click', 'td.editor-edit ', function (e) {
//     let $row = $(this).closest("tr");
//     let $id = $row.find(".col0").text();
//     //console.log("clicked")
//     editrow($id);

//  });
// Automatically add a first row of data
