const formSubmitted = () => {
    let formData = {};
    formData.organiser = $('#organiser').val();
    formData.ename = $('#ename').val();
    formData.edate = $('#edate').val();
    formData.elocation = $('#elocation').val();    
    formData.edesc = $('#edesc').val();
    formData.eimage = $('#eimage').val();

    console.log(formData);
    postEvent(formData);
}

function postEvent(event) {
    $.ajax({
        url:'/api/event',
        type:'POST',
        data:event,
        success: (result) => {
            if (result.statusCode === 201) {
                alert('event posted');
                location.reload();
            }
        }
    });
}

$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('#formSubmit').click(()=>{
        formSubmitted();
    });
    // $('.modal').modal();
    // getAllCats();
    // console.log('ready');
});