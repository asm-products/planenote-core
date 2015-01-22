(function() {
    
    window.pnalert = function(options) {
        
        var op = _.extend({
            title: "Oops..",
            msg: "An unknown error has occurred!",
            type: "error",
            btnTxt: "Refresh Page",
            onConfirm: function() {
                window.location.reload();
            }
        }, options);
        
        switch (op.error) {
            case "500":
                op.msg = "An error has occurred on the server!"
                op.btnTxt = "Ok";
                op.onConfirm = null;
                break;
            case "timeout":
                op.title = "Request timeout";
                op.msg = "Your request has timed out! Please try again.";
                op.btnTxt = "Ok";
                op.onConfirm = null;
                break;
            case "network":
                op.title = "Network error";
                op.msg = "There was a problem with your network. Make sure you are connected to the internet.";
                op.btnTxt = "Ok";
                op.onConfirm = null;
                break;
            case "auth":
                op.title = "Authentication error";
                op.msg = "You are not authenticated to perform this action. Please login.";
                op.btnTxt = "Login";
                break;
            case "503":
                op.title = "Our servers are struggling!";
                op.msg = "There are too many hits on our servers at the moment. Please try again.";
                op.btnTxt = "Ok";
                op.onConfirm = null;
                break;
            case "login":
                op.title = "Wrong login or password";
                op.msg = "The username/email or password you entered did not match.";
                op.btnTxt = "Try again";
                op.onConfirm = null;
                break;
        }
        
        window.sweetAlert({
            title: op.title,
            text: op.msg,
            type: op.type,
            confirmButtonText: op.btnTxt
        }, function(confirm) {
            if (confirm) {
                if (typeof op.onConfirm == 'function')
                    op.onConfirm();
            }
        });
        
    };
    
})();