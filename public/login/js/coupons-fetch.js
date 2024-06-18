let table = new DataTable("#showcoupons", {
  layout: {
    topStart: {
      buttons: ["copy", "csv", "excel", "pdf", "print"],
    },
  },
  ajax: {
    url: "http://localhost:3000/admin/coupons/getall",
    dataSrc: "",
  },
  columnDefs: [
    {
      target: 0,
      visible: true,
      searchable: false,
      className: "col0 d-none",
    },
    {
      targets: 3,
      render: DataTable.render.datetime("Do MMM YYYY"),
    },
    {
      targets: 4,
      render: DataTable.render.datetime("Do MMM YYYY"),
    },
  ],

  columns: [
    {
      data: "_id",
    },
    { data: "name" },
    {
      data: "discount",
      render: function (data, type) {
        return data + "%";
      },
    },
    { data: "startdate" },
    { data: "expiry" },
    {
      data: null,
      className: "dt-center editor-edit",
      defaultContent: '<i class="fa fa-pencil"/>',
      orderable: false,
      render: (data) => {
        return '<i class="fa fa-pencil"/>';
      },
    },
    {
      data: null,
      className: "dt-center editor-delete",
      defaultContent: '<i class="fa fa-trash"/>',
      orderable: false,
      render: (data) => {
        return '<i class="fa fa-trash"/>';
      },
    },
  ],
});

table.buttons().container().appendTo("#toolbar");

/** click event **/ /*
new DataTable('#example', {
  ajax: '../server_side/scripts/server_processing.php',
  processing: true,
  serverSide: true
});*/

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
    title: "Delete This Coupon!",
    content: `Are You Sure!`,
    buttons: {
      confirm: function () {
        const data = {
          id: $id,
        };

        var self = this;
        return $.ajax({
          url: `http://localhost:3000/admin/coupons/delete/`,
          dataType: "json",
          method: "DELETE",
          data: data,
        })
          .done(function (response) {
            console.log(response);
            //$.alert("Successfully added : "+ response.message);
            // location.reload(true);
            // table.row($row).remove().draw(true);
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
function dateFormat(date) {
  const xdate = new Date(date);

  const year = xdate.getFullYear();
  const month = String(xdate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(xdate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function editrow(id) {
  // e.preventDefault()
  const data = {
    id,
  };
  $.ajax({
    url: `http://localhost:3000/admin/coupons/getCoupon`,
    dataType: "json",
    method: "POST",
    data: data,
  })
    .done(function (response) {
      $("#addCoupon").click();
      $("#addOrEdit").val("edit");
      $("#editId").val(id);
      $("#code").val(response.name);
      $("#discount").val(response.discount);
      const vdate = dateFormat(response.startdate);
      const xdate = dateFormat(response.expiry);
      $("#sdate").val(vdate);
      $("#enddate").val(xdate);
    })
    .fail(function () {
      $.alert("Something went wrong.");
    });
}

// document.querySelector('#addcat').addEventListener('click', ()=>{
//     addNewRow();

// });

function clearError() {
  $("#errorcode").addClass("d-none");
  $("#errordiscount").addClass("d-none");
  $("#errorfromdate").addClass("d-none");
  $("#errorenddate").addClass("d-none");
}

// Edit record
table.on("click", "td.editor-edit ", function (e) {
  e.preventDefault();
  let $row = $(this).closest("tr");
  let $id = $row.find(".col0").text();
  console.log("This is the edit row", $id);
  clearError();
  editrow($id);
});
// Automatically add a first row of data

// $(document).ready(() => {
clearError();
const cfrm = document.getElementById("couponForm");
const closeBtn = document.getElementById("closeButton");

cfrm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("code").value,
    discount: document.getElementById("discount").value,
    startdate: document.getElementById("sdate").value,
    expiry: document.getElementById("enddate").value,
    editId: document.getElementById("editId").value,
  };

  const checkFlag = $("#addOrEdit").val();
  if (checkFlag == "add") {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/admin/coupons",
      data: data,
      success: function (response) {
        if (response.success == false) {
          if (response.data[0]?.path[0] == "name") {
            $("#errorcode").removeClass("d-none");
            $("#errorcode").html(response.data[0]?.message);
          } else {
            $("#errorcode").addClass("d-none");
          }
          if (response.data[0]?.path[0] == "discount") {
            $("#errordiscount").removeClass("d-none");

            $("#errordiscount").html(response.data[0]?.message);
          } else {
            $("#errordiscount").addClass("d-none"); //startdate
          }
          if (response.data[0]?.path[0] == "startdate") {
            $("#errorfromdate").removeClass("d-none");
            $("#errorfromdate").html(response.data[0]?.message);
          } else {
            $("#errorfromdate").addClass("d-none");
          }
          if (response.data[0]?.path[0] == "expiry") {
            $("#errorenddate").removeClass("d-none");
            $("#errorenddate").html(response.data[0]?.message);
          } else {
            $("#errorenddate").html("");
            $("#errorenddate").addClass("d-none");
          }
        } else {
          Swal.fire({
            title: "Good job!",
            text: "Catagory added Successfully",
            icon: "success",
          });
          table.ajax.reload();
          closeBtn.click();
        }

        // console.log(data);
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  } else {
    $.ajax({
      type: "PATCH",
      url: "http://localhost:3000/admin/coupons",
      data: data,
      success: function (response) {
        if (response.success == false) {
          if (response.data[0]?.path[0] == "name") {
            $("#errorcode").removeClass("d-none");
            $("#errorcode").html(response.data[0]?.message);
          } else {
            $("#errorcode").addClass("d-none");
          }
          if (response.data[0]?.path[0] == "discount") {
            $("#errordiscount").removeClass("d-none");

            $("#errordiscount").html(response.data[0]?.message);
          } else {
            $("#errordiscount").addClass("d-none"); //startdate
          }
          if (response.data[0]?.path[0] == "startdate") {
            $("#errorfromdate").removeClass("d-none");
            $("#errorfromdate").html(response.data[0]?.message);
          } else {
            $("#errorfromdate").addClass("d-none");
          }
          if (response.data[0]?.path[0] == "expiry") {
            $("#errorenddate").removeClass("d-none");
            $("#errorenddate").html(response.data[0]?.message);
          } else {
            $("#errorenddate").html("");
            $("#errorenddate").addClass("d-none");
          }
        } else {
          Swal.fire({
            title: "Good job!",
            text: "Catagory Updated Successfully",
            icon: "success",
          });
          table.ajax.reload();
          closeBtn.click();
        }
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  }
});
// });
