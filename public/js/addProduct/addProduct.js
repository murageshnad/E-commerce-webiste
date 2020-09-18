

$(document).ready(function () {
    $('.update').on('click', function (responseTxt, statusTxt, xhr) {
        event.preventDefault();
        console.log('clicked');
        let id = $(this).attr('data-type');
        console.log("type", id);
        addingProduct(id);

    });
    function addingProduct(id, count) {
        console.log('inside', id);
        // var title = $('#titles').val();
        // var price = $('#prices').val();
        // var imagePath = $('#imagePaths').val();
        var input = {
            title: $('#titles').val(),

            price: $('#prices').val(),
            imagePath: $('#Paths').val(),
            _id: id
        };
        console.log("input", input);
        //var totalQty;
        $.ajax({
            type: 'post',
            url: '/home/updateProduct/' + id,
            data: input,
            success: function (response) {
                if (response) {

                    //$("#count").append(response);
                    console.log("success", response);
                    window.location.reload();
                    //totalQty = response.totalQty;
                    // console.log("totalQty----", response.totalQty);




                }
            },
            error: function (error) {
                console.log('something went wrong !!...');
                console.log('error = ', error);
            },

        });
    }









});//cllose main