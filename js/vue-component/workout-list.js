module.exports = Vue.component('workoutList', {

    template: require('raw-loader!./templates/workout-list.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/workout').then(
            this.authProtectedRequestSuccess(function (res) { this.workouts = res.data; }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: function () { return {
        workouts: []
    }; }

});