module.exports = Vue.component('workoutForm', {

    template: require('raw-loader!./templates/workout-form.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/exercise').then(
            this.authProtectedRequestSuccess(function (res) { this.formOptions.exercises = res.data; }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {

        _submit: function () {
            this.$http.post(this.appConfig.baseUrl + '/api/workout', this.workout, { headers: { 'Content-Type': 'application/json'}}).then(
                this.authProtectedRequestSuccess(function (res) {
                    if (res.status === 201) {
                        this.message = res.data.message;
                    }
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) {
                    if (res.status === 400) {
                    console.log(res.data)
                        Object.keys(res.data.errors).forEach(function (key) {
                            this.errors[key] = res.data.errors[key];
                        }.bind(this));
                    }
                    console.log(res);
                    console.log("error");
                }.bind(this))
            );
        },

        _addExercise: function (exercise) {
            this.workout.workoutExerciseOrder.push({
                exercise: exercise.id,
                name: exercise.name,
                order: this.workout.workoutExerciseOrder.length + 1
            });
        }

    },

    data: function () { return {
        workout: {
            name: '',
            workoutExerciseOrder: [],
        },
        formOptions: {
            exercises: []
        },
        message: '',
        errors: { name: '' }
    }; }

});