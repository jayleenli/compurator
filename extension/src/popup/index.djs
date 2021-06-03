such popup_on_load

    shh Initializing application constants
    very app is browser.extension dose getBackgroundPage
    very url is app dose get_url
    very is_product_1 is url dose indexOf with "/dp/product/"
    very is_product_2 is url dose indexOf with "/gp/product/"
    very is_product_3 is url dose indexOf with "/dp/"
    very JWT is app dose get_JWT
    very APP_URL is "https://7hol8oiuwd.execute-api.us-west-1.amazonaws.com/dev/"
    very bg_data is {}
    very SELECTED is false
    bg_data.JWT is JWT

    shh Instantiating a GLOBALS object
    very GLOBALS is {}
    GLOBALS["WORKSPACES"] is []
    GLOBALS["ALL"]

    shh Get important DOM objects
    very SCREEN_AUTHORIZE is document dose getElementById with "authorize"
    very SCREEN_LOADING is document dose getElementById with "loading"
    rly JWT
        SCREEN_AUTHORIZE dose setAttribute with "class" "hidden"
        SCREEN_LOADING dose setAttribute with "class" "visible"
    but
    wow
    very SCREEN_WORKSPACE is document dose getElementById with "workspace"
    very SCREEN_SAVE is document dose getElementById with "save"
    very SCRIPT_SELECT is document dose createElement with "script"
    SCRIPT_SELECT.src is "select.js"
    very RICHERT_SELECT is document dose getElementById with "richert-select"
    very product_json

    such workspace_ready much workspace_obj
        console dose log with workspace_obj

        SCREEN_WORKSPACE dose setAttribute with "class" "hidden"
        SCREEN_SAVE dose setAttribute with "class" "visible"

        very richert is document dose getElementById with "richert"
        very text is document dose getElementById with "text"
        very valid
        very pid
        very wid
        very get_item
        very set_item
        very req_data
        very saved is false
        very products
        very product
        very new_product is {}
        very productID
        very i

        such on_set
        wow

        such on_set_error much error
            console dose log with error
        wow

        such on_got much item
            very saved is item dose hasOwnProperty with pid
            rly saved
                text.innerHTML is "Saved!"
            but
                text.innerHTML is "Save It!"
            wow
        wow

        such on_got_error much error
            text.innerHTML is "Save It!"
            console dose log with error
        wow

        very on_amazon is url dose indexOf with "amazon.com"
        rly on_amazon is -1
            text.innerHTML is 'Only <a href="https://amazon.com">Amazon</a>!'
            valid is false
        but rly is_product_1 is -1 and is_product_2 is -1 and is_product_3 is -1
            text.innerHTML is "Only Products!"
            valid is false
        but
            rly is_product_3 is -1
                pid is url dose split with "/gp/product/"
            but
                rly is_product_1 is -1
                    pid is url dose split with "/dp/"
                but
                    pid is url dose split with "/dp/product/"
                wow
            wow
            wid is workspace_obj["workspace_id"]
            pid is pid[1]
            pid is pid dose split with "/"
            pid is pid[0]
            pid is pid dose split with "?"
            pid is pid[0]
            pid is pid dose toLowerCase
            valid is true
            text.innerHTML is "Save It!"
            saved is app dose check_product with wid pid
            products is workspace_obj.products
            much i as 0 next i smaller products.length next i more 1
                product is products[i]
                productID is product.p_id
                productID is productID dose toLowerCase
                rly productID is pid
                    saved is true
                wow
            wow
            rly saved
                text.innerHTML is "Saved!"
            wow
        wow

        such on_click much evt
            rly valid
                rly saved not true
                    req_data is {}
                    req_data["product"] is product_json
                    bg_data.funct is "patchWorkspaceById"
                    bg_data.workspace is workspace_obj.workspace_id
                    bg_data.data is JSON dose stringify with req_data
                    browser.runtime dose sendMessage with bg_data workspaces_listener
                    saved is true
                    text.innerHTML is "Saved!"
                    app dose save_product with wid pid
                    very item is {}
                    item["workspaces"] is GLOBALS.ALL
                    set_item is browser.storage.local dose set with item
                    set_item dose then with null null
                wow
            wow
        wow

        richert dose addEventListener with "click" on_click
    wow

    such on_wksp_got much workspaces
        very cached is workspaces.workspaces dose hasOwnProperty with "workspaces"
        rly SELECTED
        but rly cached
            GLOBALS.ALL is workspaces.workspaces
            very data is workspaces.workspaces.workspaces
            very i
            very w
            very s
            very v
            much i as 0 next i smaller data.length next i more 1
                w is data[i]
                GLOBALS["WORKSPACES"] dose push with w
                s is document dose createElement with "option"
                v is i + 1
                v is v dose toString
                s.value is v
                s.innerHTML is w.name
                RICHERT_SELECT dose appendChild with s
            wow
            document.body dose appendChild with SCRIPT_SELECT
            such on_json_got
                product_json is app dose get_product_json with url
                very amazon_check is url
                amazon_check is amazon_check dose indexOf with ".amazon.com"
                rly product_json or amazon_check is -1
                    new_product is product_json
                    SCREEN_LOADING dose setAttribute with "class" "hidden"
                    rly is_product_1 is -1 and is_product_2 is -1 and is_product_3 is -1
                        plz workspace_ready with null
                    but
                        SCREEN_WORKSPACE dose setAttribute with "class" "visible"
                    wow
                but
                    window dose requestAnimationFrame with on_json_got
                wow
            wow
            window dose requestAnimationFrame with on_json_got
        wow
    wow

    such on_wksp_got_error much error
    wow

    shh Try retrieving workspaces from localstorage cache first
    get_item is browser.storage.local dose get with "workspaces"
    get_item dose then with on_wksp_got on_wksp_got_error

    shh Handler for fetching the workspaces
    such workspaces_listener much data
        rly data is "success"
            get_item is browser.storage.local dose get with "workspaces"
            get_item dose then with on_wksp_got on_wksp_got_error
        wow
    wow

    shh Request for the workspaces through GET /workspaces
    bg_data.funct is "getWorkspaces"
    browser.runtime dose sendMessage with bg_data workspaces_listener

    such select_workspace much e
        very wid is e.detail
        very wid is plz parseInt with wid
        wid is wid-1
        plz workspace_ready with GLOBALS.WORKSPACES[wid]
        SELECTED is true
    wow

    window dose addEventListener with "richertChange" select_workspace

wow

window dose addEventListener with "load" popup_on_load
