// CASHFLOW AI LOGIC - CEO KINGSLEY
let userBalance = parseInt(localStorage.getItem('cashflowBalance')) || 0;
let completedTasks = JSON.parse(localStorage.getItem('cashflowTasks')) || {};

// UPDATE BALANCE ON PAGE LOAD
document.getElementById('userBalance').innerText = userBalance;

// DO TASK FUNCTION
function doTask(taskName, amount, url) {
    // CHECK IF ALREADY DONE TODAY
    if (completedTasks[taskName] && taskName!== 'whatsapp') {
        alert('You don do this task today. Come back tomorrow!');
        return;
    }
    
    // OPEN TASK LINK
    if (url) window.open(url, '_blank');
    
    // ADD MONEY AFTER 5 SECONDS
    if (amount > 0) {
        setTimeout(() => {
            userBalance += amount;
            completedTasks[taskName] = new Date().toDateString();
            localStorage.setItem('cashflowBalance', userBalance);
            localStorage.setItem('cashflowTasks', JSON.stringify(completedTasks));
            document.getElementById('userBalance').innerText = userBalance;
            alert(`₦${amount} Added! Your new balance: ₦${userBalance}`);
        }, 5000);
    }
}

// WITHDRAW MONEY - PAYSTACK
function withdrawMoney() {
    if (userBalance < 1000) {
        alert('Minimum withdrawal na ₦1000. Complete more tasks!');
        return;
    }
    
    let email = prompt('Enter your email for Paystack payment:');
    if (!email) return;
    
    // PAYSTACK POPUP - REPLACE pk_test_xxx WITH YOUR KEY
    let handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxx', // REPLACE WITH YOUR PAYSTACK PUBLIC KEY
        email: email,
        amount: userBalance * 100, // Kobo
        currency: 'NGN',
        onClose: function(){
            alert('Payment cancelled');
        },
        callback: function(response){
            alert('Payment successful! Transaction: ' + response.reference);
            userBalance = 0;
            localStorage.setItem('cashflowBalance', 0);
            document.getElementById('userBalance').innerText = 0;
        }
    });
    handler.openIframe();
}

// RESET DAILY TASKS AT MIDNIGHT
const today = new Date().toDateString();
if (localStorage.getItem('lastReset')!== today) {
    localStorage.setItem('cashflowTasks', '{}');
    localStorage.setItem('lastReset', today);
}
