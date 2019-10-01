<script runat="server">
Platform.Load("core","1.1.5")
HTTPHeader.SetValue("Access-Control-Allow-Methods","POST")
HTTPHeader.SetValue("Access-Control-Allow-Origin","*")

//******************************************************************************
    MID           		= 100037854      //   The Business Unit MID
  	AccountRecordTypeId	= "0126F000000v2ccQAA"
    try{
       // Collection Location: Cloud Pages> Profiling  https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/project-object/162 
       // Cloud Pages Location:Woodlea MID-100009256    https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/edit/landing-pages/927
       BuilderChosen        = Platform.Function.TreatAsContent("%%=CloudPagesURL(907)=%%")  //  Full Location Woodlea MID-100009256 Cloud Pages> Profiling > Builder Chosen Form v2 
       // Cloud Pages Location:Woodlea MID-100009256    https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/edit/landing-pages/928
       BuildStatus          = TreatAsContent("%%=CloudPagesURL(908)=%%")    //     Full Location Woodlea MID-100009256 Cloud Pages> Profiling > Build Status Form v2 
       // Cloud Pages Location:Woodlea MID-100009256    https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/edit/landing-pages/933
       FormThankYouPage     = TreatAsContent("%%=CloudPagesURL(913)=%%")    //     Full Location Woodlea MID-100009256 Cloud Pages> Profiling > Builder Thankyou Page v2
       // Cloud Pages Location:Woodlea MID-100009256    https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/edit/landing-pages/932
       FormErrorPage         = TreatAsContent("%%=CloudPagesURL(912)=%%")   //     Full Location Woodlea MID-100009256 Cloud Pages> Profiling > Builder Error Page v2 
       // Cloud Pages Location:Woodlea MID-100009256    https://mc.s10.exacttarget.com/cloud/#app/CloudPages/CloudPages/%23cloudPages/view/edit/code-resource/930
       FormProcessingPage    = TreatAsContent("%%=CloudPagesURL(910)=%%")   //     Full Location Woodlea MID-100009256 Cloud Pages> Profiling > Builder Chosen\Status Processing Form v2
    }catch(e){
        // One of the pages have been deleted 
		//Write(Stringify(e))   
    }                                                           
//******************************************************************************  

//  Main Processing Page
    status    	 	= "Error"
    message    		= "Uknown type of request"
    eMessage      	= ""
    debug         	= false
	debugMS 		= "\r\n *************************** \r\n"
    Method        	= Platform.Request.Method 
    submitteddata 	= Platform.Request.GetPostData()
    operation     	= Method + " Get Passed Parameters"
    try{     
        if(Method == "GET"){
            action         	  = Platform.Request.GetQueryStringParameter('action')
            CaseId        	  = Platform.Request.GetQueryStringParameter('CaseId')
            PageName   		  = Platform.Request.GetQueryStringParameter('PageName')
            // PAGE1 ChosenBuilder Related Parameters
            AccountId         = Platform.Request.GetQueryStringParameter('home')
            AccountName       = Platform.Request.GetQueryStringParameter('AccountName')
            AccountNameOther  = Platform.Request.GetQueryStringParameter('OTHER')     	 /*Builder Company name from Other or Known Lookup */
            BuilderFirstName  = Platform.Request.GetQueryStringParameter('BuilderFirstName')     
            BuilderLastName   = Platform.Request.GetQueryStringParameter('BuilderLastName')
            BuilderTitle      = Platform.Request.GetQueryStringParameter('BuilderTitle')     
            BuilderEmail      = Platform.Request.GetQueryStringParameter('BuilderEmail')
            BuilderMobile     = Platform.Request.GetQueryStringParameter('BuilderMobile')
            PreferredMethod   = Platform.Request.GetQueryStringParameter('preferred-method')

            // PAGE2 Comencement Related Parameters
            BuildStatus       = Platform.Request.GetQueryStringParameter('radioButtons3')
            CompletionDate    = Platform.Request.GetQueryStringParameter('completeddate')	
        }
        if(Method == "POST"){
            action        	  = Platform.Request.GetFormField('action')
			CaseId        	  = Platform.Request.GetFormField('CaseId')
            PageName   		  = Platform.Request.GetFormField('PageName')
            // PAGE1 ChosenBuilder Related Parameters
            AccountId         = Platform.Request.GetFormField('home')
            AccountName       = Platform.Request.GetFormField('AccountName')
            AccountNameOther  = Platform.Request.GetFormField('OTHER')     	 			/*Builder Company name from Other or Known Lookup */
            BuilderFirstName  = Platform.Request.GetFormField('BuilderFirstName')     
            BuilderLastName   = Platform.Request.GetFormField('BuilderLastName')
            BuilderTitle      = Platform.Request.GetFormField('BuilderTitle')     
            BuilderEmail      = Platform.Request.GetFormField('BuilderEmail')
            BuilderMobile     = Platform.Request.GetFormField('BuilderMobile')
            PreferredMethod   = Platform.Request.GetFormField('preferred-method')

            // PAGE2 Comencement Related Parameters
            BuildStatus       = Platform.Request.GetFormField('radioButtons3')
            CompletionDate    = Platform.Request.GetFormField('completeddate')
        }
//action     	= "RetreiveAccounts"
//CaseId		= "5006F00002NDWFPQA5"	
//action     = "ChosenBuilderSubmit"
//AccountId    = myDecryptSymmetric("goLSe9pWQ4BUNuisdl6/xVw6Hhd6h/qW")
//AccountName   = "Boutique Homes"
//AccountName    = "OTHER"
//AccountName2  = "AMICUS TEST ACCOUNT 2"      
//BuilderFirstName = "Grigory 2"       
//BuilderLastName  = "AmicusTEST 2" 
//BuilderMobile  = "61449889994"  
//BuilderEmail   = "grigory2.chopik@amicusdigital.com.au"
      
   		if(action == "RetreiveAccounts"){
			formattedAccountsResults = []
			ContactDetails 	 		 = {}
			// Retreive Case Contact Name
			var Filter 					= 	[
												{Name:'Id'	, Operand : '=' , Value : CaseId}
											]
			var Fields 					=	'Id, ContactId'			 
			var result_RetreiveCase  	= 	retreiveSalesforceObjects("Case", Filter , Fields)
			if(result_RetreiveCase.Status == "OK"){
				// Retreive Case Contact Details
				var Filter 		 		= 	[
												{Name:'Id' , Operand : '=' , Value : result_RetreiveCase.Result[0].ContactId}
											] 
				var Fields 		 		=	'Id,Title,FirstName,LastName,Email,MobilePhone'
				var result_RetreiveContact  = 	retreiveSalesforceObjects("Contact", Filter , Fields)
				if(result_RetreiveContact.Status == "OK"){
						status		   =  "OK"
						ContactDetails = {
											BuilderFirstName  : result_RetreiveContact.Result[0].FirstName,
											BuilderLastName   : result_RetreiveContact.Result[0].LastName,
											BuilderTitle      : result_RetreiveContact.Result[0].Title,
											BuilderEmail      : result_RetreiveContact.Result[0].Email,
											BuilderMobile     : result_RetreiveContact.Result[0].MobilePhone
										 }
				}else{
					status    	=  "Error"
					message   	=  "RetreiveAccounts Case  Contact details retreive failed."
					eMessage    =  result_RetreiveContact.eMessage
					if (debug)  Write(eMessage)
				}
			}else{
				status    	=  "Error"
				message   	=  "RetreiveAccounts Case details retreive failed."
				eMessage    =  result_RetreiveCase.eMessage
				if (debug)  Write(eMessage)
				
			}	
			
			if( status != "Error"){
				// Retreive Account Records
				var Filter 			= 	[
											{Name:'RecordTypeId'	, Operand : '=' , Value : AccountRecordTypeId}
										]
				var Fields 			=	'Id, Name'			 
				var result_Account  = retreiveSalesforceObjects("Account", Filter , Fields)
				if(result_Account.Status == "OK")
				{
					if(result_Account.Result.length != 0)
					{
						for(r in result_Account.Result)
						{
							// Encrypt Account Id
							AccountId	=	myEncryptSymmetric(result_Account.Result[r].Id)
							// Transform Acccount Name
							AccountName = 	result_Account.Result[r].Name.replace(' Pty Ltd','').toUpperCase().replace(' PTY LTD','')
							var curRow 	= 	{
												Id		:	AccountId,
												Name	:	AccountName
											}
							formattedAccountsResults.push(curRow)
						}
						formattedAccountsResults.sort(sort_by('Name', false, function(a){return a.toUpperCase()}))

						// Add  OTHER Account Selection Value				
						formattedAccountsResults.push({
														Id		:	"OTHER",
														Name	:	"OTHER"
													})
						// Add  OWNER BUILDER Selection Value				
						formattedAccountsResults.push({
														Id		:	"OWNER BUILDER",
														Name	:	"OWNER BUILDER"
													})
						status		=  "OK"							
					}else{
						status    	=  "Error"
						message   	=  "Account records not found."
					}
				}else{
					status    	=  "Error"
					message   	=  "Account details retreive failed."
					eMessage    =  result_Account.eMessage
					if (debug)  Write(eMessage)
				}
  			}
			if( status != "Error"){
				status		=  "OK"
				message		=  	{
									AccountData : 	formattedAccountsResults,
									ContactData : 	ContactDetails,
									CaseId		:	myEncryptSymmetric(CaseId)
								}
			}	
        }      
   		if(action == "ChosenBuilderSubmit"){
          	if(!empty(AccountId)){
				CaseId 			= myDecryptSymmetric(CaseId)
				if(AccountId != 'OTHER' && AccountId != 'OWNER BUILDER'){
					var BuilderAccountId = myDecryptSymmetric(AccountId)
					/* If Contact with submitted AccoutntID and Email Matches Contact then don't attempt to create a new contact just set ID */
					var Filter 		 	= 	[
												{Name:'Email' 	  , Operand : '=' , Value : BuilderEmail},
												{Name:'AccountId' , Operand : '=' , Value : BuilderAccountId}
											] 
					var Fields 		 	=	'Id,FirstName,LastName'
					var result_RetreiveContact  = 	retreiveSalesforceObjects("Contact", Filter , Fields)
					if(result_RetreiveContact.Status == "OK")
					{
						if(result_RetreiveContact.Result.length != 0)
						{
							// Get only first record
							if (debug) Write("Contacts records retreived" + result_RetreiveContact.Result[0].Id + ' ' + result_RetreiveContact.Result[0].FirstName + ' ' + result_RetreiveContact.Result[0].LastName + debugMS)
							BuilderContactId = result_RetreiveContact.Result[0].Id
							status			 =  "OK"
						}else{
							 // Create Contact
							 if (debug) Write("Contact records not found" + debugMS)
							 var Fields 		 	= 	{ 
															AccountId 	: 	BuilderAccountId, 
															FirstName 	:	BuilderFirstName,
															LastName	:	BuilderLastName,
															MobilePhone	:	BuilderMobile,
															Email		:	BuilderEmail
														}
							 var result_CreateContact  = 	createSalesforceObject("Contact", Fields)
							 if(result_CreateContact.Status == "OK")
							 {
								if (debug) Write("Contact successfully created: " + Stringify(result_CreateContact) + debugMS)
								BuilderContactId =	result_CreateContact.Result
								status			 =  "OK"
							 }else{
								status    		 =  "Error"
								message   		 =  "Contact creation failed."
								eMessage    	 =  result_CreateContact.eMessage
								if (debug) Write(eMessage)
							 }
						}
					}else{
						status    	=  "Error"
						message   	=  "Contact details retreive failed."
						eMessage    =  result_RetreiveContact.eMessage
						if (debug) Write(eMessage)
					}	
				}else{
					// if(AccountId == 'OTHER' || AccountId == 'OWNER BUILDER')
					
					if (AccountId == "OTHER"){  
						AccountName = AccountNameOther
						
						// Create Account
						var Fields 		 	= 	{ 
													Name 			: 	AccountName, 
													RecordTypeId 	:	AccountRecordTypeId,
													Con_Email__c	:	BuilderEmail,
													Con_Mobile__c	:	BuilderMobile
												}
						var result_CreateAccount  = 	createSalesforceObject("Account", Fields)
						if(result_CreateAccount.Status == "OK")
						{
							if (debug) Write("Account successfully created: " + Stringify(result_CreateAccount) + debugMS)
							status			 =  "OK"
							BuilderAccountId =	result_CreateContact.Result
						}else{
							status    		 =  "Error"
							message   		 =  "Account creation failed."
							eMessage    	 =  result_CreateAccount.eMessage
							if (debug) Write(eMessage)
						}
					
						// Create Contact
						if( status != "Error")
						{
							var Fields 		 	= 	{ 
														 AccountId 	 : 	BuilderAccountId, 
														 FirstName 	 :	BuilderFirstName,
														 LastName	 :	BuilderLastName,
														 MobilePhone :	BuilderMobile,
														 Email		 :	BuilderEmail,
														 Title		 :	BuilderRole
													  }
							var result_CreateContact  = 	createSalesforceObject("Contact", Fields)
							if(result_CreateContact.Status == "OK")
							{
								if (debug) Write("Contact successfully created: " + Stringify(result_CreateContact) + debugMS)
								status			 =  "OK"
								BuilderAccountId =	result_CreateContact.Result
							}else{
								status    		 =  "Error"
								message   		 =  "Contact creation failed."
								eMessage    	 =  result_CreateContact.eMessage
								if (debug) Write(eMessage)
							}
						}
					}
					
					if (AccountId == "OWNER BUILDER"){
						// For this Case get Builder Account and Builder Contact from Parent Case
						// Retreive Case Contact Name
						var Filter 					= 	[
															{Name:'Id'	, Operand : '=' , Value : CaseId}
														]
						var Fields 					=	'Id, AccountId, ContactId'			 
						var result_RetreiveCase  	= 	retreiveSalesforceObjects("Case", Filter , Fields)
						if(result_RetreiveCase.Status == "OK"){
							// Retreive Case Contact Details
							var Filter 		 		= 	[
															{Name:'Id' , Operand : '=' , Value : result_RetreiveCase.Result[0].ContactId}
														] 
							var Fields 		 		=	'Id,Title,FirstName,LastName,Email,MobilePhone'
							var result_RetreiveContact  = 	retreiveSalesforceObjects("Contact", Filter , Fields)
							if(result_RetreiveContact.Status == "OK"){
									status		   	  = "OK"
									BuilderAccountId  = result_RetreiveCase.Result[0].AccountId
									BuilderFirstName  = result_RetreiveContact.Result[0].FirstName
									BuilderLastName   = result_RetreiveContact.Result[0].LastName
									BuilderRole       = result_RetreiveContact.Result[0].Title
									BuilderEmail      = result_RetreiveContact.Result[0].Email
									BuilderMobile     = result_RetreiveContact.Result[0].MobilePhone
									BuilderContactId  = result_RetreiveCase.Result[0].ContactId
							}else{
								status    	=  "Error"
								message   	=  "RetreiveAccounts Case  Contact details retreive failed."
								eMessage    =  result_RetreiveContact.eMessage
								if (debug)  Write(eMessage)
							}
						}else{
							status    	=  "Error"
							message   	=  "RetreiveAccounts Case details retreive failed."
							eMessage    =  result_RetreiveCase.eMessage
							if (debug)  Write(eMessage)
							
						}
					}	
				}
				
				//  Update Case Builder Account and Case Builder Contact Details
				if( status != "Error"){
					var Fields 		 	= 	{
												Builder_Chosen__c 					 : BuilderAccountId,
												Builder_First_Name__c 				 : BuilderFirstName,
												Builder_Last_Name__c				 : BuilderLastName,
												Builder_Role__c 				 	 : BuilderRole,
												Builder_Email__c 					 : BuilderEmail,
												Builder_Phone__c 					 : BuilderMobile,
												Preferred_method_of_communication__c : PreferredMethod,
												Builder_Contact__c 					 : BuilderContactId
											}
					var result_UpdateCase = updateSalesforceObject("Case", CaseId ,Fields)
					if(parseInt(result_UpdateCase.Result) == 1){
						if(debug) Write("Case record successfully updated" + debugMS)
						status			 =  "OK"
						message   		 =  "Data have been succesfully submitted"
					}else{
						status    		 =  "Error"
						message   		 =  "Case update failed."
						eMessage    	 =  result_UpdateCase.eMessage
						if(debug)  Write("Error update"    + eMessage + debugMS)
					}
				}	
			}else{
				status    		 =  "Error"
				message   		 =  "Home details have not been passed"
				if(debug)  Write("Error "    + message + debugMS)
			}  
           
          	if(status == "OK")
            {
                if(!debug) Redirect(FormThankYouPage , true)
            }else{
			 	if(!debug) Redirect(FormErrorPage, true)
            }
        }  
   		if(action == "ComencementSubmit"){
            if(!empty(CompletionDate))
            {
               var subDate = new Date(CompletionDate) 
           	   var yyyy  = today.getFullYear()
               var mm    = today.getMonth() + 1
               var dd    = today.getDate()
               if(mm<10) mm='0'+mm
               if(dd<10) dd='0'+dd
               CompletionDate2 = yyyy + '-' + mm + '-' + dd
            }
          	if(BuildStatus == "Construction underway/complete")
            {
            	BuildStatus = 'Construction underway'
              	var Fields 		 	  = { 
                                        	Construction_Status__c 						: 	BuildStatus,
                  							Expected_Construction_Completion_Date__c 	: 	CompletionDate2
                                        }
               	var result_UpdateCase = updateSalesforceObject("Case", CaseId ,Fields)

                if(parseInt(result_UpdateCase.Result) == 1){
                    	if(debug) Write("Case record successfully updated" + debugMS)
                    	status			 =  "OK"
                 }else{
                    	status    		 =  "Error"
                   	 	message   		 =  "Case update failed."
                    	eMessage    	 =  result_UpdateCase.eMessage
                    	if(debug)  Write("Error update"    + eMessage + debugMS)
                 }
            }else{
            	BuildStatus = "Haven't commenced building"
              	var Fields 		 	  = { 
                                        	Construction_Status__c 						: 	BuildStatus
                                        }
               	var result_UpdateCase = updateSalesforceObject("Case", CaseId ,Fields)

                if(parseInt(result_UpdateCase.Result) == 1){
                    	if(debug) Write("Case record successfully updated" + debugMS)
                    	status			 =  "OK"
                 }else{
                    	status    		 =  "Error"
                   	 	message   		 =  "Case update failed."
                    	eMessage    	 =  result_UpdateCase.eMessage
                    	if(debug)  Write("Error update"    + eMessage + debugMS)
                 }
            }  
          	if(status == "OK")
            {
                if(!debug) Redirect(FormThankYouPage , true)
            }else{
			 	if(!debug) Redirect(FormErrorPage, true)
            }
        }      	
     	// Generic Functions Section
     	function empty( val ){
			 // test results
			 //---------------
			 // []        true, empty array
			 // {}        true, empty object
			 // null      true
			 // undefined true
			 // ""        true, empty string
			 // ''        true, empty string
			 // 0         false, number
			 // true      false, boolean
			 // false     false, boolean
			 // Date      false
			 // function  false
			if (val === undefined)
				return true
			if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
				return false
			if (val == null || val.length === 0)        // null or 0 length array
				return true
			if (typeof (val) == "object") 
			{
				// empty object
			   var r = true;
				for (var f in val)
				   r = false;
				return r
			}
			return false
		}
		// Here's a flexible version, which allows you to create reusable sort functions, and sort by any field.
		// Sort by price high to low
		// example.sort(sort_by('price', true, parseInt))
		// Sort by city, case-insensitive, A-Z
		// example.sort(sort_by('city', false, function(a){return a.toUpperCase()}))
		//
		function sort_by(field, reverse, primer){
		   var key = primer ? 
			   function(x) {return primer(x[field])} : 
			   function(x) {return x[field]};

		   reverse = !reverse ? 1 : -1

		   return function (a, b) {
			   return a = key(a), b = key(b), reverse * ((a > b) - (b > a))
			 } 
		}
		function myEncryptSymmetric(encryptstring){
			// This function utilize encryption\decription of sensitive information 
			Variable.SetValue('@encryptstring', encryptstring)
			TreatAsContent('%%[ SET @EncryptedString = EncryptSymmetric(@encryptstring, "des;mode=ecb;padding=pkcs7", @null, "WOO-f9R2", @null, @null, @null, @null) ]%%')
			return Base64Encode(Variable.GetValue('@EncryptedString'))
		}
		function myDecryptSymmetric(decryptstring){
			// This function utilize encryption\decription of sensitive information 
			Variable.SetValue('@decryptstring', Base64Decode(decryptstring))
			TreatAsContent('%%[ SET @DecryptedString = DecryptSymmetric(@decryptstring, "des;mode=ecb;padding=pkcs7", @null, "WOO-f9R2", @null, @null, @null, @null) ]%%')
			return Variable.GetValue('@DecryptedString') 
		}
		
		function retreiveSalesforceObjects(sfObject, Filter , Fields){
			/*
				= 	(is equal to)
				< 	(is less than)
				> 	(is greater than)
				!= 	(is not equal to)
				<= 	(is less than or equal to)
				>= 	(is greater than or equal to)
			*/
			var response = 	{	
								Status   : "Error",
								Result   : [],
								eMessage : ''
							}
			
            FieldListArr 	  = Fields.split(',')
            retreiveSFObject  = ""
            retreiveSFObject += "[\%\%[ "
         	retreiveSFObject += "SET @SFRetreiveResults = RetrieveSalesforceObjects('" + sfObject + "',"
          	retreiveSFObject += "'" + Fields + "'"
          	for(i in Filter)
            {
				retreiveSFObject += ",'" + Filter[i].Name + "', '" + Filter[i].Operand + "', '" +  Filter[i].Value + "'"	
            }
          	retreiveSFObject += ") "
          	retreiveSFObject += "FOR @r = 1 TO ROWCOUNT(@SFRetreiveResults) DO "
            retreiveSFObject += "SET @SFResultCurrentRow = ROW(@SFRetreiveResults,@r) /*  get row based on counter */ "
         	for(i in FieldListArr)
            {
              	var TrimmedFieldName = FieldListArr[i].replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')	
              	retreiveSFObject += ' SET @'+ TrimmedFieldName + ' = FIELD(@SFResultCurrentRow,"'+ TrimmedFieldName + '") '
            }
          	retreiveSFObject += " ]\%\%"
         	retreiveSFObject += "{"
              for(i in FieldListArr)
              {	
                  if(i != 0)  retreiveSFObject += ','
                  var TrimmedFieldName = FieldListArr[i].replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')	
                  retreiveSFObject += TrimmedFieldName + ' : "\%\%=v(@' + TrimmedFieldName + ')=\%\%"'
              }
          	retreiveSFObject += "},"
          	retreiveSFObject += "\%\%[  NEXT @r ]\%\%"
            retreiveSFObject += "]"
          	try
            {
              	var result 	 	 = Platform.Function.TreatAsContent(retreiveSFObject)
				response.Status	 = "OK"
                response.Result	 = Platform.Function.ParseJSON(result)
                /*
					for(arr in responseJSON)
					{
						for(v in responseJSON[arr])
						{
							Write(v + ' : ' + responseJSON[arr][v] + ' \r\n')
						}  
					}
				*/
				
                if (debug) Write(Stringify(response) + debugMS)
           	} catch (e) {
				response.eMessage = Stringify(e)
				if (debug) Write('<br>retreiveSFObject Error: ' + Stringify(e) + debugMS)
			}
			return response
		}
      	function createSalesforceObject(sfObject, Fields){
			/*
				  sfObject 	Required 	Type of object to Create, such as Lead, COntact etc.
				  JSON 	  	Required 	The Name of field and Value of Field to create object record { FirstName : "James" , LastName : "Jones"}
			*/
			var response = 	{	
								Status   : "Error",
								Result   : '',
								eMessage : ''
							}  
			createSFObject 	 	 = ""
			createSFObject		+= "\%\%[ "
			createSFObject		+= "SET @CreateResult = CreateSalesforceObject("
			createSFObject		+= "'"  + sfObject 			+ "'," 	// Saleforce Object Name
			var FieldsNumber     = Fields.length + 1
			createSFObject		+= "'"  + FieldsNumber 		+ "'"  	// Number of fields specified to add in the recor
			
			for(i in Fields)
			{
				createSFObject	+= ",'" + i 				+ "'," 	// Field Name
				createSFObject	+= "'"  + Fields[i] 		+ "'"  	// Field Value
			}
			createSFObject += ") "
			createSFObject += "output(concat(@CreateResult)) "
			createSFObject += "]\%\%"
          Write(createSFObject + debugMS)
			try {
				var result 		 = Platform.Function.TreatAsContent(createSFObject)
				response.Status	 = "OK"
                response.Result	 = result
			} catch (e) {
				response.eMessage = Stringify(e)
				if (debug) Write("createSFObject Error: " + Stringify(e) + debugMS)
			}
			return response
		}
      	function updateSalesforceObject(sfObject, ID, Fields){
			/*
				  sfObject 	Required 	Type of object to update, such as Lead or CustomObject
				  ID 		Required 	The ID of the object  to update
				  JSON 	  	Required 	The name of the field to update and The value to update the field with { FirstName : "James" , LastName : "Jones"}
			*/
			var response = 	{	
								Status   : "Error",
								Result   : 0,
								eMessage : ''
							} 
			var SalesforceIdPattern = new RegExp("^[a-zA-Z0-9]{18}");
			if (SalesforceIdPattern.test(ID) == true)
			{	  
				updateSFObject 	 	 = ""
				updateSFObject		+= "\%\%[ "
				updateSFObject		+= "SET @UpdateResult = UpdateSingleSalesforceObject("
				updateSFObject		+= "'" + sfObject 	+ "'," 	// Saleforce Object Name
				updateSFObject		+= "'" + ID 		+ "'"  	// ID Value	
				for(i in Fields)
				{
					updateSFObject	+= ",'" + i 		+ "'," 	// Field Name
					updateSFObject	+= "'" + Fields[i] 	+ "'"  	// Field Value
				}
				updateSFObject += ") "
				updateSFObject += "output(concat(@UpdateResult)) "
				updateSFObject += "]\%\%"
				try {
					var result 		 = Platform.Function.TreatAsContent(updateSFObject)
					response.Status	 = "OK"
					response.Result	 = result
				} catch (e) {
					response.eMessage = Stringify(e)
					if (debug) Write("updateSFObject Error: " + Stringify(e) + debugMS)
				}
			}
			return response
		}
     	// Generic Functions Section
		var response    =  	{
								status    	: status,
								message   	: message,
								eMessage  	: eMessage
					   		}    
		Write(Stringify(response))     
   }catch(e){
		// log error to Form Error Log
		//LogError("error", Stringify(e), operation, SubmittedData)
		var response 	=  {
								status   : error,
								message  : "Form failed",
								eMessage : Stringify(e)
						   }    
		Write(Stringify(response))
		//if(!debug) Redirect(FormErrorPage, true)
  }
// Main Processing Page 
   
     
</script>