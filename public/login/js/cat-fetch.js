const table = new DataTable("#showchart", {
  ajax: "http://localhost:3000/admin/catagory/get",
  order: [[1, "asc"]],
  columnDefs: [
    {
      target: 0,
      visible: true,
      searchable: false,
      className: "col0 d-none",
    },
    {
      target: 1,
      width: "60%",
    },
  ],
  columns: [
    { data: "_id" },
    { data: "name" },
    { data: "status" },

    {
      data: null,
      className: "dt-center editor-edit",
      defaultContent: '<i class="fa fa-pencil"/>',
      orderable: false,
    },
    {
      data: null,
      className: "dt-center editor-delete",
      defaultContent: '<i class="fa fa-trash"/>',
      orderable: false,
    },
  ],
});

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
          url: `http://localhost:3000/admin/catagory/del`,
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
              //console.log(response.success);
              // location.reload(true);
              if (response.success) {
                table.row
                  .add({ _id: response.id, name: name, status: true })
                  .draw(true);
              } else {
                $.alert(response.message);
              }
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
    url: `http://localhost:3000/admin/catagory/getcat`,
    dataType: "json",
    method: "post",
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
                url: `http://localhost:3000/admin/catagory/edt`,
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
                  if (response.message == "success") table.ajax.reload();
                  else $.alert("Category Already Existed !");
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

document.getElementById("addcat").addEventListener("click", () => {
  addNewRow();
});

// Edit record
table.on("click", "td.editor-edit ", function (e) {
  let $row = $(this).closest("tr");
  let $id = $row.find(".col0").text();
  editrow($id);
});
// Automatically add a first row of data
