let table = new DataTable("#userTable", {
  ajax: "http://localhost:3000/admin/users/getall",
  order: [[1, "asc"]],
  columnDefs: [
    {
      target: 0,
      visible: true,
      searchable: false,
      className: "col0 d-none",
    },
    {
      target: 3,
      visible: true,
      searchable: false,
      className: "col3 ",
    },
  ],
  columns: [
    { data: "_id" },
    { data: "name" },
    { data: "email" },
    { data: "status" },
    {
      data: null,
      className: "unlist-list",

      render: (data) => {
        return data.status == "Deactive"
          ? '<button class="btn btn-danger usr" id="btn-unlist"  >Unblock</button>'
          : '<button class="btn btn-primary usr" id="btn-list">Block</button>';
      },
    },
  ],
});

table.on("click", "td.unlist-list", function (e) {
  let $row = $(this).closest("tr");
  let $id = $row.find(".col0").text();
  let $status = $row.find(".col3").text();
  $.confirm({
    theme: "modern",
    title: $status == "Active" ? "Block User?!" : "Unblock User?!",
    content: "Are you sure ?!",
    buttons: {
      confirm: function () {
        const data = {
          id: $id,
          status: $status,
        };

        let self = this;
        return $.ajax({
          url: `http://localhost:3000/admin/block-user/`,
          dataType: "json",
          method: "post",
          data: data,
        })
          .done(function (response) {
            // location.reload(true);
            table.ajax.reload();
          })
          .fail(function () {
            self.setContent("Something went wrong.");
          });
      },
      cancel: function () {},
    },
  });
  // }
});
