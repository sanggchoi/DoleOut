# team53 - Christopher Marcok, Lance Oribello, David Choi

[Phase 1 README](client/README.md)

[Heroku](https://doleout.herokuapp.com/)

If you need to build locally, clone the repo and navigate to team53/client. Skip this if you are on heroku.

1. run `npm install` to install the client dependencies.
2. run `npm run build`.
3. run `cd ..` to return to the team53 folder.
4. run `npm install` to install the server dependencies.
5. run `npm run dev`
6. open `localhost:5000` in Google Chrome

![](https://imgur.com/HeufiYu.png)
![](https://imgur.com/oDTu7im.png)
![](https://imgur.com/IjJFp9I.png)

# Notes

Very rarely, there's an error or something unexpected happens. Refreshing the page should always fix the problem. Sometimes I encountered crashes with React that I could not replicate - it's best to just refresh and hopefully it doesn't happen again. 

In addition, sometimes you will have two tabs open during the demo. When this happens the website can be very squished and some things will be impossible to see. For example, if the window width is too small, the sidebars in the group page will disappear to make more space for the chat. It's best if you have two monitors or can alt tab between the tabs.

If you want to try using many different users, there are about 10 different users you can choose from, with names/passwords `userX` where X is a number from 2 to 10. The username and password are both identical.

----------------------
# WALKTHROUGH - ADMIN

Not a whole lot as changed from Phase 1. Here is a list of things to try to do.

### `/login`
From the home page, click login in the header, or click the "DoleOut" title in the middle of the screen. Enter the credentials:
* Username: admin, Password: admin

### `/groups`
Everything on this page works identically to how it did in Phase 1. The only difference is that everytime you complete an action a corresponding HTTP request is made.

* Admins are able to view all groups, even ones they are not a member of. They can also delete and edit any group.
* ### DO NOT DELETE "MyNewGroup". It will be used in the USER walkthrough. There's no getting it back...
* Make a group using the big green button on the bottom of the screen. Sorry the adding users section is not a drop-down, but the consolation is that the valid/invalid indicator works near instantly on heroku, rather than the sluggish time on localhost. Still, it is usable.
* Try renaming a group
* Then try deleting it
* Click on a group to enter it

After any of these actions you can try to refresh the page to make sure that the database was updated and your changes were saved.

### `g/:group_id`

Everything in this page works identically to how it did in Phase 1 as well. The only signficant change is that we implemented socket.io so that chat messages are shown in real time. Try opening a new tab and go to the same group; any messages you type appear in real time on the other tab. Notifications pop up in the chat when someone leaves or joins the "chat". If you open an incognito tab and log in as another user, you can open the same group and see the message appear in the first tab. Notice that for groups with admins in them, admins have their name marked in red in the members list of the group (if none of the group members are admins you won't see any names marked in red).

Admins are also able to create messages in groups that they are not members of. They can also delete messages/expenses and users from any group, once again without membership to the group. The admin doesn't have an infinite wallet balance, so he still needs to add money to his account if he cannot pay an expense.

Users (and admins) have balances - you cannot make a payment on an expense with an insufficient balance. Try typing `!balance` in the chat to check your user's balance.

### `/u/:user_number`

Everything is similar to how it worked in Phase 1. Admins can now edit anyone's profile - they just need to click the edit button in the top right corner. Any of the info can be edited - it should be noted that if you try to add funds to another user's account as an admin, it will just add the funds to the admin's account. Clicking the save button in the top right will save your changes (refresh to make sure it saved). In addition, admins are able to see the balance of any user. This is not the case for users (they can see their own balance, but not the balances of other users).

That's it for the admin. Click the Logout button in the top right to log out. You will be returned to the home page.

----------------------
# WALKTHROUGH - USER

### `/register`

Try making a user with some issues. For instance, make a user with symbols in the username, where the passwords don't match, where the password is too short, or has a username that is already taken (hint: "user" is a taken username). For any of these instances, a toast appears telling the user what went wrong.

Try to register the following user:
* Username: user12345, Password: user12345

Proceed to `/login` and try to login with the credentials you just made.

After logging in you will be redirected to the group's page, which is empty, since you just made this user. Since this is pretty boring, let's log out and log back in with credentials
* Username: user, Password: user

### `/groups`

This page is the same as the admin's. You may notice some groups have the ability to be edited/deleted. This is because "user" is the creator of these groups and thus has admin privileges within the domain of that group.

Click "MyNewGroup" to enter it.

### `/g/:group_id`

Firstly, open an incognito tab with ctrl+shift+n and go to doleout.herokuapp.com and login with credentials
* Username: user2, Password: user2

Join the "MyNewGroup" as user2. Send a message, and watch it appear in the other tab. Click the delete button on your message and watch it disappear in the other tab. Users are able to delete their own messages. Notice that "user" is marked in blue in the member's list on the left. This is because he created the group and has admin privileges within the group.

From the "user" tab (the not incognito one), click the new expense button at the top. Make an expense for bread with cost $10.00 and add "user2" as the only member (it should be noted that expense creation does not deplete from your site balance as it is assumed that you used an outside source to pay for it in full - e.g. with your credit card). It should look something like the EXAMPLE Bread expense already in the chat. When you make the expense, it should appear in the other tab in real time. **NOTE:** Paying expenses doesn't happen in real time due to time constraints. You can always refresh the tab to see that the expense has updated.

As "user", you may not pay the expense you just made (since you presumably paid for it in full already), but the other user "user2" can. Click the pay button on the expense you just made in the incognito/user2 tab. Enter the amount you want to pay and pay it. The problem is that user2 is too poor to afford anything. Type "!balance" in the chat to view the balance of the user you are logged in as - you will see that user2 has no money.

From the incognito tab, click "My Profile" from the header. "user" will get a notification in the group's chat that you left.

### `/u/:user_number`
Notice your doleout wallet amount - this only shows if you are on your own profile or you are logged in as admin. It is time to add money to your wallet. 

1. Click the edit button in the top right to open the editing panel.
2. Scroll to the bottom of the page.
3. Click "Add Funds to DoleOut Wallet"
4. Enter the custom amount or just click "Add Funds".
5. Login to PayPal with these credentials: (unfortunately PayPal wouldn't let me change them)
* Email: `sb-fnles657413@personal.example.com`
* Password: `y-54l(*L`
6. Select "Pay With PayPal Balance" and click continue.
7. You are redirected to your DoleOut profile, and you have new funds in your DoleOut Wallet!
8. Log into `https://www.sandbox.paypal.com/` with the above credentials. You can see that you just paid "John Doe's Test Store" with the amount you entered! "John Doe's Test Store" is actually code for "DoleOut", but we'll keep that just between us two. Log out from PayPal.
9. Log into `https://www.sandbox.paypal.com/` with the email `sb-4pnnu429614@business.example.com` and password `admin123`. You can see that you just received a payment from "user user" corresponding to the amount they entered (default $100.00).
10. Leave PayPal. Return to "MyNewGroup" logged in as "user2". You can type `!balance` again to check that you have money in your wallet.
11. Pay the expense. You have to pay at least 1 cent at a time. Paying 0 cents or a negative number will cause a toast to popup showing you the errors in your ways.
12. Since you were the last (and only) user that needed to pay this expense, the expense is greyed out and removed from the "current expenses" section in the sidebar. This expense is all paid up!
