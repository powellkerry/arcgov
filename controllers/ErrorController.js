arcgov.errors = {
    handleError: function(data, status) {
        if (status == 401) {
            window.location = '/#/login';
        } else if (data.error) {
            this.showErrorMessage(data.error);
        } else {
            this.showErrorMessage();
        }
    },
    showErrorMessage: function(message) {
        if (message) {
            $('.error').text(message);
        } else {
            $('.error').text('Unknown server error');
        }
        $('.error').show();
        setTimeout(function() {$('.error').hide();}, 5000);
    }
};