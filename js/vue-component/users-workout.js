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
        }

    },

    data: function () { return {
        usersWorkout: {
            workout: {},
            usersWorkout: {},
            exercises: {},
            workoutExerciseOrder: {},
            usersWorkoutStatistics: {},
        }
    }; }
});
