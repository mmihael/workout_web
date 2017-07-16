var Chart = require('chart.js');
module.exports = Vue.component('workoutChart', {

    template: require('raw-loader!./templates/workout-chart.html'),

    data: function () { return {
        workoutData: {}
    }; },

    methods: {

        fetchWorkoutData: function () {
            this.$http.get(this.appConfig.baseUrl + '/api/user/workout/latest/' + this.$route.params.id).then(
                this.authProtectedRequestSuccess(function (res) { 
                    this.workoutData = res.data;
                    this.drawChart();
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        },

        drawChart: function () {
            var data = { labels: [], datasets: [] };
            var dataset = {

                label: "Workout " + this.workoutData.workout.name,

                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],

                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],

                borderWidth: 1,

                data: []

            };
            this.workoutData.statistics.reverse();
            for (var i = 0; this.workoutData.statistics.length > i; i++) {
                var createdAt = new Date();
                createdAt.setTime(this.workoutData.statistics[i].usersWorkout.createdAt);
                data.labels.push(createdAt.getFullYear() + '-' + (parseInt(createdAt.getMonth()) + 1) + '-' + createdAt.getDate());
                var sum = 0;
                for (var j = 0; this.workoutData.statistics[i].usersWorkoutStatistics.length > j; j++) {
                    var weight = this.workoutData.statistics[i].usersWorkoutStatistics[j].weight;
                    weight = weight != null ? weight : 1;
                    sum += this.workoutData.statistics[i].usersWorkoutStatistics[j].reps * weight;
                }
                dataset.data.push(sum);
            }
            data.datasets.push(dataset);
            var myChart = new Chart(document.getElementById("workout-chart"), {
                type: 'bar',
                data: data,
                options: {
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }

    },

    mounted: function () {
        this.fetchWorkoutData();
    }

});