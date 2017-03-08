module.exports = Vue.component('login', {

    template: require('raw-loader!./templates/login.html'),

    data: function () { return {
        username: '',
        password: ''
    }; },

    methods: {

        _goToRegister: function () {
            this.$router.push('/register');
        },

        _login: function () {
            this.$http.post(
                this.appConfig.baseUrl + '/login',
                "username=" + encodeURIComponent(this.username) + "&password=" + encodeURIComponent(this.password),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
            ).then(function (res) {
                if (res.status === 200) {
                    this.$emit('logged-in');
                    this.$emit('notify', { message: 'Logged in', type: 'success'});
                } else {
                    this.$emit('notify', { message: 'Invalid username or password', type: 'danger'});
                }
            }, function (res) {
                this.$emit('notify', { message: 'Invalid username or password', type: 'danger'});
            });
        },
    }

});