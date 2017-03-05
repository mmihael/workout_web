module.exports = Vue.component('register', {

    template: require('raw-loader!./templates/register.html'),

    data: function () { return {
        req: {
            username: '',
            email: '',
            password: '',
            passwordRepeat: ''
        },
        errors: {
            username: ''
        },
        message: ''
    }; },

    methods: {

        _goToLogin: function () {
            this.$router.push('/');
        },

        _register: function () {

            Object.keys(this.errors).forEach(function (key) {
                this.errors[key] = '';
            }.bind(this));

            this.$http.post(this.appConfig.baseUrl + '/api/register', this.req, { headers: { 'Content-Type': 'application/json'}}).then(
                function (res) {
                    if (res.status === 201) {
                        this.message = res.data.message;
                        console.log(res.data.user);
                    }
                },
                function (res) {
                    if (res.status === 400) {
                    console.log(res.data)
                        Object.keys(res.data.errors).forEach(function (key) {
                            this.$set(this.errors, key, res.data.errors[key]);
                        }.bind(this));
                    }
                }
            );
        },
    }

});