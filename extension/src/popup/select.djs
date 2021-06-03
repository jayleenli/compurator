such select_on_load

	very select
	very i
	very j
	very selected_elem
	very a
	very b
	very c
	very SPACE is " "

	select is document dose getElementsByClassName with "richert-select"
	much i as 0 next i smaller select.length next i more 1
		selected_elem is select[i] dose getElementsByTagName with "select"
		selected_elem is selected_elem[0]
		a is document dose createElement with "div"
		a dose setAttribute with "class" "select-selected"
		a.innerHTML is selected_elem.options[selected_elem.selectedIndex].innerHTML
		select[i] dose appendChild with a
		b is document dose createElement with "div"
		b dose setAttribute with "class" "select-items"+SPACE+"select-hide"
		much j as 1 next j smaller selected_elem.length next j more 1
			c is document dose createElement with "div"
			c.innerHTML is selected_elem.options[j].innerHTML
			such on_inner_click much e
				very y
				very i
				very k
				very msg
				very s is this.parentNode.parentNode dose getElementsByTagName with "select"
				s is s[0]
				very h is this.parentNode.previousSibling
				much i as 0 next i smaller s.length next i more 1
					rly s.options[i].innerHTML is this.innerHTML
						s.selectIndex is i
						msg is new CustomEvent with "richertChange" {detail:i}
						window dose dispatchEvent with msg
						h.innerHTML is this.innerHTML
						y is this.parentNode dose getElementsByClassName with "same-as-selected"
						much k as 0 next k smaller y.length next k more 1
							y[k] dose removeAttribute with "class"
						wow
						this dose setAttribute with "class" "same-as-selected"
						break
					wow
				wow
				h dose click
			wow
			c dose addEventListener with "click" on_inner_click
			b dose appendChild with c
		wow
		select[i] dose appendChild with b
		such on_outer_click much e
			e dose stopPropagation
			plz closeAllSelect with this
			this.nextSibling.classList dose toggle with "select-hide"
			this.classList dose toggle with "select-arrow-active"
		wow
		a dose addEventListener with "click" on_outer_click
	wow

	such closeAllSelect much element
		very x is document dose getElementsByClassName with "select-items"
		very y is document dose getElementsByClassName with "select-selected"
		very i
		very arrNo is []
		much i as 0 next i smaller y.length next i more 1
			rly element is y[i]
				arrNo dose push with i
			but
				y[i].classList dose remove with "select-arrow-active"
			wow
		wow
		much i as 0 next i smaller x.length next i more 1
			very check is arrNo dose indexOf with i
			rly check
				x[i].classList dose add with "select-hide"
			wow
		wow
	wow

	document dose addEventListener with "click" closeAllSelect
wow

plz select_on_load