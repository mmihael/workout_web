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
                } else {
                    alert("Invalid login");
                }
            }, function (res) {
                console.log(0);
                console.log(res);
            });
        },
    }

});