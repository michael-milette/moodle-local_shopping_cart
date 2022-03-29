// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    local_shopping_cart
 * @copyright  Wunderbyte GmbH <info@wunderbyte.at>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';

export const init = (users, userid = 0) => {
    // eslint-disable-next-line no-console
    console.log('run init', userid);

    document.getElementById('checkout-tab').classList.remove('success');

    const buybutton = document.querySelector('#buy-btn');
        // eslint-disable-next-line no-console
        console.log(buybutton);
        if (buybutton) {
            buybutton.addEventListener('click', function() {
                confirmPayment(userid);
            });
        }

    const checkoutbutton = document.querySelector('#checkout-btn');
    // eslint-disable-next-line no-console
    console.log(checkoutbutton);
    if (checkoutbutton) {
        checkoutbutton.addEventListener('click', function() {

            document.getElementById('checkout-tab').classList.add('success');
            // eslint-disable-next-line no-console
            console.log('click');
        });
    }

    autocomplete(document.getElementById("searchuser"), users);
    attachFilterFuntion();

     /**
      * Attach filter function.
      */
    function attachFilterFuntion() {
        const input = document.querySelector("#shoppingcartfilterinput");
        input.addEventListener("keyup", () => {
            const filter = input.value.toUpperCase();
            const li = document.querySelectorAll(".list-group-item.wunderbyteTableJavascript");
            for (let i = 0; i < li.length; i++) {
                const a = li[i];
                const txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        });
    }

    /**
     * Confirm successful payment via ajax.
     * @param {integer} userid
     */
    function confirmPayment(userid) {
        Ajax.call([{
            methodname: "local_shopping_cart_confirm_cash_payment",
            args: {
                'userid': userid
            },
            done: function(data) {

                if (data.status == 1) {
                    // eslint-disable-next-line no-console
                    console.log('payment confirmed');
                    document.getElementById('success-tab').classList.add('success');

                    // We might display the item more often than once.
                    let items = document.querySelectorAll('ul.shopping-cart-items li.clearfix');

                    items.forEach(item => {
                        // eslint-disable-next-line no-console
                        console.log(item);
                        if (item) {
                            item.remove();
                        }
                    });
                    let totalprices = document.querySelectorAll('#shopping_cart-cashiers-section .totalprice');

                    totalprices.forEach(item => {
                        // eslint-disable-next-line no-console
                        console.log(item);
                        if (item) {
                            item.innerText = 0;
                        }
                    });

                } else {
                    // eslint-disable-next-line no-console
                    console.log('payment denied');
                    document.getElementById('success-tab').classList.add('error');
                }
            },
            fail: function(ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            },
        }]);
    }
};

export const validateCart = ($userid) => {
    // eslint-disable-next-line no-alert
    alert($userid);
 };

/**
 * The autocomplete function takes two arguments.
 * The text field element and an array of possible autocompleted values.
 * @param {string} inp
 * @param {array} arr
 */
 export const autocomplete = (inp, arr) => {
    var currentFocus;
    const useridfield = document.querySelector('#useridfield');
    inp.addEventListener("input", function() {
        var a, b, i;
        let val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].toUpperCase().indexOf(val.toUpperCase()) > -1) {
                /* Create a DIV element for each matching element: */
                b = document.createElement("DIV");
                /* Make the matching letters bold: */
                let index = arr[i].toUpperCase().indexOf(val.toUpperCase());
                b.innerHTML = arr[i].substr(0, index);
                b.innerHTML += "<strong>"
                        + arr[i].substr(arr[i].toUpperCase().indexOf(val.toUpperCase()), val.length) + "</strong>";
                b.innerHTML += arr[i].substr(index + val.length);
                /* Insert a input field that will hold the current array item's value: */
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function() {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    useridfield.value = this.getElementsByTagName("input")[0].value.split('uid:')[1];
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
        return null;
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) {
            x = x.getElementsByTagName("div");
        }
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) {
                x[currentFocus].click();
            }
          }
        }
    });

    /**
     * Add active.
     * @param {*} x
     */
    function addActive(x) {
        if (!x) {
            return;
        }
        removeActive(x);
        if (currentFocus >= x.length) {
            currentFocus = 0;
        }
        if (currentFocus < 0) {
            currentFocus = (x.length - 1);
        }
        x[currentFocus].classList.add("autocomplete-active");
    }

    /**
     * Remove active.
     * @param {*} x
     */
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    /**
     * Close all list elements.
     * @param {*} elmnt
     */
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
  };
