(async () => {
  try {
    const response = await fetch("http://localhost:3000/admin/dashboardData", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    const {
      productCount,
      userCount,
      categoryCount,
      pendingOrdersCount,
      totalOrdersCount,
      totalRevenue,
      currentDayRevenue,
      currentMonthRevenue,
      currentWeekRevenue,
      categoryWiseRevenue,
    } = data;

    const totalAmount = new Intl.NumberFormat("en-IN", {
      maximumSignificantDigits: 3,
      style: "currency",
      currency: "INR",
    }).format(totalRevenue);

    document.getElementById("totalRevenue").innerText = totalAmount;
    // document.getElementById("productsCount").innerText = productCount;
    document.getElementById("userCount").innerText = userCount + " Nos";
    document.getElementById("totalOrderCount").innerText =
      totalOrdersCount + " Nos";
    document.getElementById("pendingOrderCount").innerText =
      pendingOrdersCount + " Nos";
    /*document.getElementById('currentDayRevenue').innerText = '₹' + currentDayRevenue
        document.getElementById('currentMonthRevenue').innerText = '₹' + currentMonthRevenue
       document.getElementById('currentWeekRevenue').innerText = '₹' + currentWeekRevenue*/

    const weeklySalesChartElement = document.getElementById("acquisitions");

    const weeklySalesChartOptions = {
      type: "bar",
      data: {
        labels: currentWeekRevenue.date,
        datasets: [
          {
            label: "Current week revenue per day",
            data: currentWeekRevenue.revenue,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
      },
    };

    const categoryWiseRevenueChartElement = document.getElementById(
      "categoryWiseRevenueChart"
    );
    const categoryWiseRevenueChartOptions = {
      type: "doughnut",
      data: {
        labels: categoryWiseRevenue.categoryName,
        datasets: [
          {
            data: categoryWiseRevenue.revenuePerCategory,
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 255, 0, 0.5)",
              "rgba(169, 169, 169, 0.5)",
              "rgba(0, 0, 255, 0.5)",
            ],
          },
        ],
      },
    };
    const monthlyRevenueChartElement = document.getElementById(
      "monthWiseRevenueChart"
    );
    const monthlySalesChartOptions = {
      type: "bar",
      data: {
        labels: currentMonthRevenue.month,
        datasets: [
          {
            label: "Monthly Revenue",
            data: currentMonthRevenue.revenue,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    new Chart(weeklySalesChartElement, weeklySalesChartOptions);
    new Chart(monthlyRevenueChartElement, monthlySalesChartOptions);
    new Chart(categoryWiseRevenueChartElement, categoryWiseRevenueChartOptions);
  } catch (error) {
    console.error(error);
  }
})();
