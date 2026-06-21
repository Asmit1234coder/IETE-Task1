const hoverCards = document.querySelectorAll(
    '.destination-card, .booking-card'
);

hoverCards.forEach(card => {

    card.addEventListener('mouseenter', () => {

        card.style.boxShadow =
        '0 20px 40px rgba(0,0,0,0.20)';

    });

    card.addEventListener('mouseleave', () => {

        card.style.boxShadow =
        '0 4px 8px rgba(0,0,0,0.2)';

    });

});

const form = document.querySelector('.form-text');

form.addEventListener('submit', function(e){

    e.preventDefault();

    const emailInput =
        document.querySelector('.form-control');

    const email = emailInput.value.trim();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(emailRegex.test(email)){

        alert('Thank you for subscribing!');

        form.reset();

    }else{

        alert('Please enter a valid email address.');

        emailInput.focus();

    }
});