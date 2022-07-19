const apiUrl="https://todoo.5xcamp.us";
let data=[];

const empty=document.querySelector(".empty");
const cardList=document.querySelector(".card_list");
const body=document.querySelector("body");

const signupAccount=document.getElementById("signupEmail");
const signupNickname=document.getElementById("signupNickname");
const signupPassword=document.getElementById("signupPassword");
const checkPassword=document.getElementById("checkPassword");
const signupBtn=document.getElementById("signup");
const loginWeb=document.querySelector(".loginWeb");
const signUp=document.querySelector(".signUp");
const logIn=document.querySelector(".login");
const todoList=document.querySelector(".todoList");
const nickname=document.getElementById("nickname");

if (localStorage.getItem('token')) {
  body.classList.remove("fontPage");
  body.classList.add("todolist");
  todoList.classList.remove("none");
  logIn.classList.add("none");
  axios.defaults.headers.common['Authorization']=localStorage.getItem("token");
  nickname.textContent=localStorage.getItem("nickname");
  getTodo();
}

loginWeb.addEventListener("click", e => {
  e.preventDefault();
  signUp.classList.add("none");
  logIn.classList.remove("none");
})
signupBtn.addEventListener("click",() => {
  callSignup();
});
function callSignup(){
  const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const reg = new RegExp(/^\w{6,}$/);
  if(signupAccount.value.trim()=="" || signupNickname.value.trim()=="" || signupPassword.value.trim()=="" || checkPassword.value.trim()==""){
    alert('請輸入正確資料');
    return
  }else if(!regex.test(signupAccount.value)){
    alert('請輸入正確email格式');
    return
  }else if(signupPassword.value != checkPassword.value){
    alert('密碼不正確');
    return
  }else if(!reg.test(signupPassword.value)){
    alert('密碼小於6位數或輸入的密碼並非全由數字組成');
    return
  };
  let obj={
    email:signupAccount.value,
    nickname:signupNickname.value,
    password:signupPassword.value
  };
  axios.post(`${apiUrl}/users`,{
    "user": obj
  })
  .then(res => {
    alert("註冊成功");
    body.classList.remove("fontPage");
    body.classList.add("todolist");
    todoList.classList.remove("none");
    signUp.classList.add("none");
    nickname.textContent=res.data.nickname;
    console.log(res);
    axios.defaults.headers.common['Authorization']=res.headers.authorization;
    localStorage.setItem("token",res.headers.authorization);
    localStorage.setItem("nickname",res.data.nickname);
    getTodo();
  })
  .catch(error => console.log(error.response));
};

const loginEmail=document.getElementById("loginEmail");
const loginPassword=document.getElementById("loginPassword");
const loginBtn=document.getElementById("login");
const signupWeb=document.querySelector(".signupWeb");
signupWeb.addEventListener("click", e => {
  e.preventDefault();
  logIn.classList.add("none");
  signUp.classList.remove("none");
});
loginBtn.addEventListener("click",() => {
  callLogin();
})
function callLogin(){
  const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const reg = new RegExp(/^\w{6,}$/);
  if(loginEmail.value.trim()=="" || loginPassword.value.trim()==""){
    alert('請輸入正確資料');
    return
  }else if(!regex.test(loginEmail.value)){
    alert('請輸入正確email格式');
    return
  }else if(!reg.test(loginPassword.value)){
    alert('密碼小於6位數或輸入的密碼並非全由數字組成');
    return
  };
  let obj={
    email:loginEmail.value,
    password:loginPassword.value
  };
  axios.post(`${apiUrl}/users/sign_in`,{
    "user": obj
  })
  .then(res => {
    axios.defaults.headers.common['Authorization']=res.headers.authorization;
    alert("登入成功");
    body.classList.remove("fontPage");
    body.classList.add("todolist");
    todoList.classList.remove("none");
    logIn.classList.add("none");
    nickname.textContent=res.data.nickname;
    loginEmail.value='';
    loginPassword.value='';
    localStorage.setItem("token",res.headers.authorization);
    localStorage.setItem("nickname",res.data.nickname);
    console.log(res);
      getTodo();   
  })
  .catch(error => {
    alert('此帳號不存在或帳號密碼錯誤');
    loginEmail.value='';
    loginPassword.value='';
    console.log(error.response)
  })
}

const logout=document.getElementById("logout");
logout.addEventListener("click",(e) => {
  e.preventDefault();
  axios.delete(`${apiUrl}/users/sign_out`)
    .then(res => {
      alert(res.data.message);
      body.classList.remove("todolist");
      body.classList.add("fontPage");
      todoList.classList.add("none");
      logIn.classList.remove("none");
      axios.defaults.headers.common['Authorization']  = "";
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      console.log(res)
    })      
    .catch(error => {
      console.log(error.response)
    });
})


function getTodo(){
   axios.get(`${apiUrl}/todos`)
  .then(res => {
    data=res.data.todos;
    if(data.length == 0){
      cardList.classList.add("none");
      empty.classList.remove("none");
    }else{
      empty.classList.add("none");
      cardList.classList.remove("none");
    }
    updateList();
    console.log(res);
  })
  .catch(error => console.log(error.response))
}

const addItem = document.getElementById("addItem");
const txt = document.getElementById("txt");
const list = document.getElementById("list");

addItem.addEventListener("click", () => {
  addTodo()
});

function addTodo(){
  if (txt.value.trim() == "") {
    alert("請輸入內容");
    return;
  }
  let obj = {
    "content": txt.value,
  };  
  axios.post(`${apiUrl}/todos`,{"todo": obj})
    .then(res => { 
      data.unshift(res.data);
      txt.value = "";
      getTodo();
      tabStatus="all";
      toggleTab();      
      console.log(res)})
  .catch(error => console.log(error.response))
}

function render(data) {
  let str = "";
  let ready="";
  data.forEach((item) => {
    if(item.completed_at != null){
      ready="checked";
    }else{
      ready="";
    }
    str += `<li data-id="${item.id}">
          <label class="checkbox" for="">
            <input type="checkbox" ${ready}/>
            <div>
              <input type="text" value="${item.content}" disabled />
            </div>           
          </label>
          <a href="#" class="update"></a>
          <a href="#" class="delete"></a>
        </li>`;
  });
  list.innerHTML = str;
}

list.addEventListener("click", (e) => {
  let id = e.target.closest("li").dataset.id;
  if (e.target.getAttribute("class") == "delete") {
    e.preventDefault();
    axios.delete(`${apiUrl}/todos/${id}`)
      .then(res => {
        tabStatus="all";
        toggleTab();
        getTodo();
        console.log(res)
      })
      .catch(error => console.log(error.response)) 
  }else if(e.target.getAttribute("class") == "update" ){
    e.preventDefault();
    const checkbox = e.target.parentElement.firstChild.nextSibling.children[0];
    const edit = e.target.parentElement.firstChild.nextSibling.children[1];
    let str;
    if(edit.classList.contains('edit')){
      edit.classList.remove('edit');
      checkbox.style.zIndex = '1'; 
      str=edit.children[0].value;
      axios.put(`${apiUrl}/todos/${id}`,{
        "todo": {
          "content": str
        }           
      })
        .then(res => {
          getTodo();
          console.log(res)
        })
        .catch(error => console.log(error.response))
    }else{
      edit.classList.add('edit');
      edit.children[0].disabled = false;      
      checkbox.checked = false; 
      checkbox.style.zIndex = '-1';
    }
  }else if(e.target.getAttribute("type") == "checkbox") {
    axios.patch(`${apiUrl}/todos/${id}/toggle`,{})
      .then(res => {
        getTodo();
      console.log(res)})
      .catch(error => console.log(error.response))
    }; 
});

const tab = document.getElementById("tab");
let tabStatus = "all";
tab.addEventListener("click", (e) => {
  tabStatus = e.target.dataset.tab;
  toggleTab();
  updateList();
});

function toggleTab(){
  let tabList=document.querySelectorAll('#tab li');
  tabList.forEach(item => {
    item.classList.remove('active');
    if(item.dataset.tab == tabStatus){
      item.classList.add('active');
    }
  });
}

const items = document.querySelector(".list_footer p");

function updateList() {
  let arr = [];
  if (tabStatus == "finished") {
    arr = data.filter((item) => item.completed_at != null);
  } else if (tabStatus == "unfinished") {
    arr = data.filter((item) => item.completed_at == null);
  } else {
    arr = data;
  };
  let arrLength = data.filter((item) => item.completed_at == null);
  items.textContent = `${arrLength.length}個待完成項目`;
  render(arr);
};

updateList();


const deleteItem = document.getElementById("deleteItem");
deleteItem.addEventListener("click",(e) =>{
  e.preventDefault();
  let arr=[];
  arr=data.filter( item => item.completed_at != null );
  arr.forEach((item) => {
    axios.delete(`${apiUrl}/todos/${item.id}`)
      .then(res => {
        tabStatus="all";
        toggleTab();
        getTodo();
        console.log(res)
      })
      .catch(error => {
        console.log(error.response);
      }) 
  })
})

