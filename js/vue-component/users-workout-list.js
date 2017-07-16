module.exports = Vue.component('usersWorkoutList', {

    template: require('raw-loader!./templates/users-workout-list.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/user/workout').then(
            this.authProtectedRequestSuccess(function (res) { this.usersWorkouts = res.data; console.log(this.usersWorkouts); }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {
        _yyyymmdd: function (date) {
          var date = new Date(date);
          return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate();
        },
        _deleteUsersWorkout: function (usersWorkoutId) {
            this.$http.delete(this.appConfig.baseUrl + '/api/user/workout/' + usersWorkoutId).then(
                this.authProtectedRequestSuccess(function (res) {
                    if (res.data.status === 0) {
                        var deleteIndex = null;
                        for (var i = 0; i < this.usersWorkouts.length; i++) {
                            if (this.usersWorkouts[i].id === usersWorkoutId) {
                                deleteIndex = i;
                                break;
                            }
                        }
                        if (deleteIndex !== null) {
                            this.usersWorkouts.splice(deleteIndex, 1);
                            this.$emit('notify', { message: res.data.message, type: 'success' });
                        }
                    } else {
                        this.$emit('notify', { message: res.data.message, type: 'danger' });
                    }
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        }
    },

    data: function () { return {
        usersWorkouts: []
    }; }

});