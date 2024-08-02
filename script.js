
function show() {
  var x = document.getElementById("pass");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById("showimg").src =
      "https://static.thenounproject.com/png/777494-200.png";
  } else {
    x.type = "password";
    document.getElementById("showimg").src =
      "https://cdn2.iconfinder.com/data/icons/basic-ui-interface-v-2/32/hide-512.png";
  }
}


document.getElementById('login-form').onsubmit = async function (e) {
    e.preventDefault();
    
    const user = document.getElementById('user').value;
    const password = document.getElementById('pass').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
          body: JSON.stringify({ user, password }),
      });

      const result = await response.json();
      
      if (result.success) {
          window.location.href = '../../admin';
        } else {
            document.getElementById('login-error').innerText = 'Invalid username or password';
        }
    } catch (error) {
        document.getElementById('login-error').innerText = 'An error occurred. Please try again later.';
    }
};

// document.getElementById('x').onclick = function () {
//   document.getElementById("aaa").style.display="none";
// }
// document.getElementById('ext-sup-button').onclick = function () {
//   document.getElementById("add-supplier").style.display="none";
// }









  