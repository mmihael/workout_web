module.exports = Vue.component('workoutPick', {

    template: require('raw-loader!./templates/workout-pick.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/workout').then(
            this.authProtectedRequestSuccess(function (res) { this.workouts = res.data; }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {
        _startWorkout: function (workoutId) {
            this.$http.post(this.appConfig.baseUrl + '/api/user/workout', { workout: workoutId }, { headers: { 'Content-Type': 'application/json'}}).then(
                this.authProtectedRequestSuccess(function (res) {
                    console.log(res);
                    console.log(res.body.usersWorkout.id);
                    this.$router.push('/users/workout/' + res.body.usersWorkout.id);
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        }
    },

    data: function () { return {
        workouts: []
    }; }

});