module.exports = Vue.component('usersWorkout', {

    template: require('raw-loader!./templates/users-workout.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/user/workout/' + this.$route.params.id).then(
            this.authProtectedRequestSuccess(function (res) { this.usersWorkout = res.data; console.log(this.usersWorkout); }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {

        _updateUsersWorkoutStatistic: function (usersWorkoutStatistic) {
            console.log(usersWorkoutStatistic);
            this.$http.patch(this.appConfig.baseUrl + '/api/user/workout/statistic/' + usersWorkoutStatistic.id, usersWorkoutStatistic, { headers: { 'Content-Type': 'application/json'}}).then(
                this.authProtectedRequestSuccess(function (res) {
                    console.log(res);
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        },

        _stopWatchToggle: function () {
            this.stopWatch.show = !this.stopWatch.show;
        },

        _stopWatchStart: function () {
            if (this.audio == null) {
                this.audio = new Audio('/beep.m4a');
                this.audio.play();
                this.audio.pause();
            }
            if (this.stopWatch.started != null) { return; }
            this.stopWatch.started = new Date().getTime();
            var stopWatchUpdater = function () {
                this.stopWatch.elapsed = new Date().getTime() - this.stopWatch.started;
                if (this.stopWatch.elapsed < this.stopWatch.total * 1000) {
                    setTimeout(stopWatchUpdater, 250);
                } else {
                    var play = 3;
                    var playFunction = function () {
                        this.audio.play();
                        play--;
                        if (play > 0) {
                            setTimeout(playFunction, 500);
                        }
                    }.bind(this);
                    playFunction();
                    this.stopWatch.elapsed = 0;
                    this.stopWatch.started = null;
                }
            }.bind(this);
            stopWatchUpdater();
        }

    },

    data: function () { return {
        audio: null,
        usersWorkout: {
            workout: {},
            usersWorkout: {},
            exercises: {},
            workoutExerciseOrder: {},
            usersWorkoutStatistics: {},
        },
        stopWatch: {
            show: false,
            total: 60,
            started: null,
            elapsed: 0
        }
    }; }
});
