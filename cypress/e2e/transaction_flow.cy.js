describe('end to end transaction test',()=>{
    it('balance validation', ()=>{
        const users = [
            {username:'mary', password:'Ryan02', account:'0809521153'},
            {username:'Kola', password:'Kolayemi',account:'4039622432'}
        
        ]

        let transferamount = 100

        //test steps

        //logging as a receiver

        cy.visit('http://localhost:5000')
        cy.get('a[href="/login"]').click()
        cy.get('input[name="username"]').type(users[0].username)
        cy.get('input[name="password"]').type(users[0].password)
        cy.contains('button[type="submit"]','Login').click()
        cy.get('#balance').should('be.visible')

        //validating receiver current account balance
        cy.get('#balance').invoke('text').then((receiverbalance)=>{
            const realbalance = parseFloat(receiverbalance.replace('$',''))
            cy.wrap(realbalance).as('updatedbalance')
          }) 



        //ending session as a receiver -changing toggle to mobile view to access the logout button

        cy.viewport(375, 667)
        cy.get('button[class="menu-toggle"]').click()
        cy.contains('a[class="nav-link"]','Logout').click()




        //logging in as a sender
        cy.visit('http://localhost:5000')
      cy.get('a[href="/login"]').click()
      cy.get('input[name="username"]').type(users[1].username)
      cy.get('input[name="password"]').type(users[1].password)
      cy.contains('button[type="submit"]','Login').click()
      cy.get('#balance').should('be.visible')


      //validating sender current balance
      cy.get('#balance').invoke('text').then((balanceno)=>{
        const realbalance = parseFloat(balanceno.replace('$',''))
        cy.wrap(realbalance).as('senderbalance')
      })
      cy.get('div[class="account-balance"]').should('be.visible')
        cy.contains(".action-card", "Send Money").click()
        cy.url().should('include','#transfers')
        cy.get('div[class="dashboard-section"]').should('be.visible')

        //inputting transfer details of receiver account and transfer amount
      cy.get('input[id="to_account"]').type('0809521153')
      cy.get('input[id="amount"]').type(transferamount.toString())
      cy.contains('button[type="submit"]','Send Money').click()
      cy.wait(1000)

      //validating sender balance after transfer
      cy.get('@senderbalance').then((oldbalance)=>{
        cy.log(oldbalance)
        cy.get('#balance').should('contain', (parseFloat(oldbalance) - parseFloat(transferamount)))
      })

      cy.reload()
      cy.get('#balance').should('contain', '$')
      cy.contains('h2.section-title','Transaction History').scrollIntoView().should('be.visible')
      cy.get('.section-header').its('length').should('be.greaterThan',0)
      cy.contains('.transaction-account', '0809521153').should('be.visible')

      //logging session out as a sender 

      cy.get('button[class="menu-toggle"]').click()
      cy.contains('a[class="nav-link"]','Logout').click()

      //logging in as a receiver to validate balance after transfer
      cy.visit('http://localhost:5000')
      cy.get('a[href="/login"]').click()
      cy.get('input[name="username"]').type(users[0].username)
      cy.get('input[name="password"]').type(users[0].password)
      cy.contains('button[type="submit"]','Login').click()

      cy.get('@updatedbalance').then((newvalue)=>{
        cy.log(newvalue)
        cy.get('#balance').should('contain', (parseFloat(newvalue) + parseFloat(transferamount)))
      })



    })
 
})