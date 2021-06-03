shh Initialize all tab variables

very URL is "https://7hol8oiuwd.execute-api.us-west-1.amazonaws.com/dev/"

very CONSTANTS is {}
CONSTANTS["getWorkspaces"] is {}
CONSTANTS.getWorkspaces["method"] is "GET"
CONSTANTS.getWorkspaces["url"] is URL+"/workspaces"

CONSTANTS["postWorkspaces"] is {}
CONSTANTS.postWorkspaces["method"] is "POST"
CONSTANTS.postWorkspaces["url"] is URL+"/workspaces"

CONSTANTS["getWorkspaceById"] is {}
CONSTANTS.getWorkspaceById["method"] is "GET"
CONSTANTS.getWorkspaceById["url"] is URL+"/workspaces/"

CONSTANTS["patchWorkspaceById"] is {}
CONSTANTS.patchWorkspaceById["method"] is "PATCH"
CONSTANTS.patchWorkspaceById["url"] is URL+"/workspaces/"

very current_tab
very current_bookmark
very product_json is {}
very product_cache is {}
very JWT

such get_JWT
    rly JWT
    wow JWT
wow null

such save_product much wid pid
    rly product_cache[wid]
        product_cache[wid][pid] is true
    but
        product_cache[wid] is {}
        product_cache[wid][pid] is true
    wow
wow

such check_product much wid pid
    rly product_cache[wid]
        rly product_cache[wid][pid]
        wow true
    wow
wow false

such get_product_json much url
    rly product_json[url]
    wow product_json[url]
wow null

such get_url
    rly current_tab
    wow current_tab.url
wow null

such update_icon
wow

such toggle_bookmark
    rly current_tab
        console dose log with "Running on "+current_tab.url
    but 
        console dose log with "No active tab"
    wow
wow

browser.browserAction.onClicked dose addListener with toggle_bookmark

such update_active_tab much tabs
    such update_tab much tabs
        rly tabs[0]
            rly current_tab and current_tab.url is tabs[0].url
            wow null
            current_tab is tabs[0]
        wow
    wow

    very getting_active_tab is browser.tabs dose query with {active: true, currentWindow: true}

    getting_active_tab dose then with update_tab
wow

such message_handler much request sender callback
    very funct_code is request.funct
    rly CONSTANTS[funct_code] is undefined
        rly funct_code is "scrape"
            product_json[current_tab.url] is request.product_json
            console dose log with product_json
        but rly funct_code is "jwt"
            JWT is request.jwt
        wow
        plz callback
    but
        funct is CONSTANTS[funct_code]

        such on_set
        wow

        such on_set_error much error
            console dose log with error
        wow

        such do_callback
            very callback_data is JSON dose parse with xhr.responseText
            very workspace_save is callback_data dose hasOwnProperty with "workspaces"
            rly workspace_save
                very item is {}
                item["workspaces"] is callback_data
                set_item is browser.storage.local dose set with item
                set_item dose then with on_set on_set_error
            wow
            plz callback with "success"
        wow

        such error_callback
            plz callback with "error"
        wow

        very xhr is new XMLHttpRequest
        xhr.onload is do_callback
        xhr.onerror is error_callback
        very send_url is funct.url
        rly funct_code is "patchWorkspaceById"
            send_url is send_url+request.workspace
        wow
        xhr dose open with funct.method send_url true
        rly request.JWT
            xhr dose setRequestHeader with "Authorization" request.JWT
        wow
        rly funct.method is "GET"
            xhr dose send
        but rly funct.method is "PATCH"
            xhr dose send with request.data
        but rly funct.method is "POST"
            xhr dose send with request.data
        wow
    wow
wow true

browser.runtime.onMessage dose addListener with message_handler

browser.tabs.onUpdated dose addListener with update_active_tab
browser.tabs.onActivated dose addListener with update_active_tab
browser.windows.onFocusChanged dose addListener with update_active_tab

plz update_active_tab
