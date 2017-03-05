module.exports = Vue.component('exerciseForm', {

    template: require('raw-loader!./templates/exercise-form.html'),

    methods: {

        _submit: function () {
            this.$http.post(this.appConfig.baseUrl + '/api/exercise', this.exercise, { headers: { 'Content-Type': 'application/json'}}).then(
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
        }

    },

    data: function () { return {
        exercise: { name: '', bodyWeight: false },
        message: '',
        errors: { name: '' }
    }; }

});