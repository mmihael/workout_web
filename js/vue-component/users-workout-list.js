module.exports = Vue.component('usersWorkoutList', {

    template: require('raw-loader!./templates/users-workout-list.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/user/workout').then(
            this.authProtectedRequestSuccess(function (res) { this.usersWorkouts = res.data; console.log(this.usersWorkouts); }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: function () { return {
        usersWorkouts: []
    }; }

});