var QR_Image = document.getElementById("qr-image");
var QR_Input = document.getElementById("qr-input");

function generateQR() {
    
        QR_Image.src = " https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+QR_Input.value;
    
}