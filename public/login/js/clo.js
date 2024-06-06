var countdown = $("#countdown").countdown360({
  radius: 60,
  seconds: 90,
  fontColor: "#FFFFFF",
  autostart: false,
  onComplete: function () {
    $("#verify").hide();
    $("#resendverify").show();
  },
});

$("#timer").on("click", () => {
  countdown.start();
  $("#resendverify").hide();
});

//console.log("countdown360 ", countdown);
// $(document).on("click", "button", function (e) {
//   e.preventDefault();
//   var type = $(this).attr("data-type");
//   if (type === "time-remaining") {
//     var timeRemaining = countdown.getTimeRemaining();
//     //alert(timeRemaining);
//   } else {
//     var timeElapsed = countdown.getElapsedTime();
//     //alert(timeElapsed);
//   }
// });
