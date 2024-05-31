const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    signDisplay: "always",

})

const list = document.getElementById("transactionlist");
const form = document.getElementById("transactionsform");
const msg = document.getElementById("msg");
const balance= document.getElementById("balance");
const income= document.getElementById("income");
const expense= document.getElementById("expense");

form.addEventListener("submit", addTransaction);
function updateTotal(){
    const incometotal =transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount,0);
    const expensetotal =transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total +trx.amount,0);

    const balanceTotal = incometotal - expensetotal;
    balance.textContent = formatter.format(balanceTotal).substring(1);
    income.textContent = formatter.format(incometotal);
    expense.textContent = formatter.format(expensetotal * -1);





}

    
    
function renderlist() {
    list.innerHTML = "";


    msg.textContent = "";
    if (transactions.length === 0) {
        msg.textContent = "No transactions";
        return;
    } else{
        msg.textContent = "";
    }
    transactions.forEach(({ id, name, amount, date, type }) => {
        const sign='expense'===type? -1 : 1;
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
        </div>
        <div  class="amount ${type}">
        <span>${formatter.format(amount *sign)}</span>
        </div>
        <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" onclick="deletetransaction(${id})">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
        </svg>


        `;
        list.appendChild(li);

    });

}
renderlist();
updateTotal();

function deletetransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);
    renderlist();
}
function addTransaction(e) {
    e.preventDefault();
  
    const formData = new FormData(this);
  
    transactions.push({
      id: transactions.length + 1,
      name: formData.get("name"),
      amount: parseFloat(formData.get("amount")),
      date: new Date(formData.get("date")),
      type: "on" === formData.get("type") ? "income" : "expense" ,
     
    });
  
    this.reset();
    updateTotal();
    saveTransactions();
    renderlist();
  }
  function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }