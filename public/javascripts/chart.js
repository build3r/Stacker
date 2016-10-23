google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['Tag', 'Number of occurances'],
        ['NodeJs',      4],
        ['Java',     3],
        ['C++',  1],
        ['Python', 1]
    ]);

    var options = {
        title: 'Number of questions',
        is3D: false
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}