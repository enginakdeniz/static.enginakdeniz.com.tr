/**
 * @package Helix Ultimate Framework
 * @author JoomShaper https://www.joomshaper.com
 * @copyright Copyright (c) 2010 - 2021 JoomShaper
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or Later
 */

// Preloader
jQuery(window).on('load', function () {
	if (jQuery('.sp-loader-with-logo').length > 0) {
		move();
	}
	jQuery('.sp-pre-loader').fadeOut(500, function () {
		jQuery(this).remove();
	});
});

/**
 * Move the progress bar
 */
function move() {
	var elem = document.getElementById('line-load');
	var width = 1;
	var id = setInterval(frame, 10);
	function frame() {
		if (width >= 100) {
			clearInterval(id);
		} else {
			width++;
			elem.style.width = width + '%';
		}
	}
}

jQuery(function ($) {
	/**
	 * Helix settings data
	 *
	 */
	var settings = Joomla.getOptions('data') || {};

	/**
	 * Device wise sticky header
	 *
	 * @param {string} className the header className
	 */
	var deviceWiseStickyHeader = function (className, offsetTop) {
		if ($('body:not(.layout-edit-iframe)').hasClass(className)) {
			var $header = $('#sp-header');
			var headerHeight = $header.outerHeight();
			var $stickyHeaderPlaceholder = $('.sticky-header-placeholder');
			let $stickyOffset = '100';

			if (settings.header !== undefined && settings.header.stickyOffset !== undefined) {
				$stickyOffset = settings.header .stickyOffset || '100';
			}

			var stickyHeader = function () {
				var scrollTop = $(window).scrollTop();
				if (scrollTop >= offsetTop + Number($stickyOffset)) {
					$header.addClass('header-sticky');
					$stickyHeaderPlaceholder.height(headerHeight);
				} else {
					if ($header.hasClass('header-sticky')) {
						$header.removeClass('header-sticky');
						$stickyHeaderPlaceholder.height('inherit');
					}
				}
			};

			stickyHeader();
			$(window).scroll(function () {
				stickyHeader();
			});

			if ($('body').hasClass('layout-boxed')) {
				var windowWidth = $header.parent().outerWidth();
				$header.css({ 'max-width': windowWidth, left: 'auto' });
			}
		} else {
			var $header = $('#sp-header');
			if ($header.hasClass('header-sticky')) {
				$header.removeClass('header-sticky');
			}
			$(window).off('scroll');
		}
	};

	/**
	 * Calculate the header offset based on the
	 * backend preview iframe site and real site.
	 *
	 * @return  integer The offset value
	 */
	function getHeaderOffset() {
		/**
		 * Real site header offset top
		 *
		 */
		let $header = $('#sp-header');
		let stickyHeaderTop = $header.offset().top;

		/**
		 * Backend edit preview iframe header offset top
		 *
		 */
		let $backHeader = $('body.back-panel').find('#sp-header');
		let backPanelStickyHeaderTop = null;

		/**
		 * If the class .back-panel exists,
		 * that means this is from backend preview frame,
		 * then get the offset top, as it varies with the original one.
		 *
		 */
		if ($backHeader.length > 0) {
			backPanelStickyHeaderTop = $backHeader.offset().top;
		}

		// By Default the header offset is the original header top
		let headerOffset = stickyHeaderTop;

		/**
		 * If back panel sticky header top has value rather than null
		 * that means the device type is changes from desktop to table or mobile or vice-versa.
		 * If value found then subtract the settings topbar height from the offset top.
		 *
		 */
		if (backPanelStickyHeaderTop !== null) {
			headerOffset = backPanelStickyHeaderTop - settings.topbarHeight;
			headerOffset = headerOffset < 0 ? stickyHeaderTop : headerOffset;
		}

		return headerOffset;
	}

	function handleStickiness() {
		deviceWiseStickyHeader('sticky-header', getHeaderOffset());

		/** @TODO: uncomment it if devicewise sticky header is required. */

		/* let width = window.innerWidth;
		if (width > settings.breakpoints.tablet) {
			deviceWiseStickyHeader('sticky-header', getHeaderOffset());
		} else if (
			width <= settings.breakpoints.tablet &&
			width > settings.breakpoints.mobile
		) {
			deviceWiseStickyHeader('sticky-header-md', getHeaderOffset());
		} else {
			deviceWiseStickyHeader('sticky-header-sm', getHeaderOffset());
		} */
	}
	const headerExist = $('#sp-header');
	if(headerExist.length>0) {
		handleStickiness();
	}

	/*$(window).on('resize', function (e) {
		if(headerExist.length>0) {
			handleStickiness();
		}
	});*/

	// go to top
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.sp-scroll-up').fadeIn();
		} else {
			$('.sp-scroll-up').fadeOut(400);
		}
	});

	$('.sp-scroll-up').click(function () {
		$('html, body').animate(
			{
				scrollTop: -60,
			},
			600
		);
		return false;
	});

	//mega menu
	$('.sp-megamenu-wrapper').parent().parent().css('position', 'static').parent().css('position', 'relative');
	$('.sp-menu-full').each(function () {
		$(this).parent().addClass('menu-justify');
	});

	// Offcanvs
	$('#offcanvas-toggler').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').addClass('offcanvas-active');
	});

	$('.offcanvas-toggler-secondary').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').addClass('offcanvas-active');
	});

	$('.offcanvas-toggler-full').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').addClass('offcanvas-active full-offcanvas');
	});

	$('.close-offcanvas, .offcanvas-overlay').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').removeClass('offcanvas-active full-offcanvas');
	});

	$(document).on('click', '.offcanvas-inner .menu-toggler', function (event) {
		event.preventDefault();
		$(this).closest('.menu-parent').toggleClass('menu-parent-open').find('>.menu-child').slideToggle(400);
	});

	// Modal Menu
	if ($('#modal-menu').length > 0) {
		let $modalToggler = $('#modal-menu-toggler');
		let $modalMenu = $('#modal-menu');
		let $body = $('body');

		$modalToggler.on('click', function (e) {
			e.preventDefault();
			$modalMenu.toggleClass('active');
			$body.toggleClass('modal-menu-active');
			$(this).toggleClass('active');
		});

		// modal menu close with escape
		$(document).keyup(function (e) {
			if (e.key == 'Escape') {
				$modalMenu.removeClass('active');
				$modalToggler.removeClass('active');
				$body.removeClass('modal-menu-active');
			}
		});
	}

	// Tooltip
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"], .hasTooltip'));
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl,{
			html: true
		  });
	});

	// Popover
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl);
	});

	// Article Ajax voting
	$('.article-ratings .rating-star').on('click', function (event) {
		event.preventDefault();
		var $parent = $(this).closest('.article-ratings');

		var request = {
			option: 'com_ajax',
			template: template,
			action: 'rating',
			rating: $(this).data('number'),
			article_id: $parent.data('id'),
			format: 'json',
		};

		$.ajax({
			type: 'POST',
			url: "https://enginakdeniz-com-tr.azurewebsites.net/api/sendMessage?code=v8EOpS1Utn_MvAxXdwiMHQGZN8Vie_JKVwoCYORJ-363AzFuez679w==",
			data: request,
			beforeSend: function () {
				$parent.find('.fa-spinner').show();
			},
			success: function (response) {
				var data = $.parseJSON(response);
				$parent.find('.ratings-count').text(data.message);
				$parent.find('.fa-spinner').hide();

				if (data.status) {
					$parent.find('.rating-symbol').html(data.ratings);
				}

				setTimeout(function () {
					$parent.find('.ratings-count').text('(' + data.rating_count + ')');
				}, 3000);
			},
		});
	});

	//  Cookie consent
	$('.sp-cookie-allow').on('click', function (event) {
		event.preventDefault();

		var date = new Date();
		date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
		var expires = '; expires=' + date.toGMTString();
		document.cookie = 'spcookie_status=ok' + expires + '; path=/';

		$(this).closest('.sp-cookie-consent').fadeOut();
	});

	$('.btn-group label:not(.active)').click(function () {
		var label = $(this);
		var input = $('#' + label.attr('for'));

		if (!input.prop('checked')) {
			label.closest('.btn-group').find('label').removeClass('active btn-success btn-danger btn-primary');
			if (input.val() === '') {
				label.addClass('active btn-primary');
			} else if (input.val() == 0) {
				label.addClass('active btn-danger');
			} else {
				label.addClass('active btn-success');
			}
			input.prop('checked', true);
			input.trigger('change');
		}
		var parent = $(this).parents('#attrib-helix_ultimate_blog_options');
		if (parent) {
			showCategoryItems(parent, input.val());
		}
	});
	$('.btn-group input[checked=checked]').each(function () {
		if ($(this).val() == '') {
			$('label[for=' + $(this).attr('id') + ']').addClass('active btn btn-primary');
		} else if ($(this).val() == 0) {
			$('label[for=' + $(this).attr('id') + ']').addClass('active btn btn-danger');
		} else {
			$('label[for=' + $(this).attr('id') + ']').addClass('active btn btn-success');
		}
		var parent = $(this).parents('#attrib-helix_ultimate_blog_options');
		if (parent) {
			parent.find('*[data-showon]').each(function () {
				$(this).hide();
			});
		}
	});

	function showCategoryItems(parent, value) {
		var controlGroup = parent.find('*[data-showon]');

		controlGroup.each(function () {
			var data = $(this).attr('data-showon');
			data = typeof data !== 'undefined' ? JSON.parse(data) : [];
			if (data.length > 0) {
				if (typeof data[0].values !== 'undefined' && data[0].values.includes(value)) {
					$(this).slideDown();
				} else {
					$(this).hide();
				}
			}
		});
	}

	$(window).on('scroll', function () {
		var scrollBar = $('.sp-reading-progress-bar');
		if (scrollBar.length > 0) {
			var s = $(window).scrollTop(),
				d = $(document).height(),
				c = $(window).height();
			var scrollPercent = (s / (d - c)) * 100;
			const position = scrollBar.data('position');
			if (position === 'top') {
				// var sticky = $('.header-sticky');
				// if( sticky.length > 0 ){
				//     sticky.css({ top: scrollBar.height() })
				// }else{
				//     sticky.css({ top: 0 })
				// }
			}
			scrollBar.css({ width: `${scrollPercent}%` });
		}
	});

	/*----------  UNITEMPLATES IMPROVEMENTS  ----------*/	
    // nonsticky from go to top
    if ($('body').hasClass('nonsticky')) {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 80) {
				$('#sp-header').addClass('nonsticky');
			} else {
				$('#sp-header').removeClass('nonsticky');
			}
		});
	}
});

/*----------  UNITEMPLATE PURE JS  ----------*/
addEventListener("DOMContentLoaded", function () {
	createOnepageNav();
	
	getScroll();

	//Venobox
	const venoClass = document.querySelector('.venobox');
	if (venoClass) {
		new VenoBox({
		    selector: '.venobox',
	        titleattr:'data-title',
	        toolsColor:'#ffffff',
		});
	}
});

addEventListener('resize', function() {
	createOnepageNav();
	getScroll();
});

// Onepage navigation
function createOnepageNav(){
	const megaMenu = document.querySelector('.onepage-mega .sp-megamenu-parent');
	const offcanvasMenu = document.querySelector('.onepage-offcanvas .menu.nav-pills');
	megaMenu ? onepageNav(megaMenu) : '';
	offcanvasMenu ? onepageNav(offcanvasMenu) : '';
}

function onepageNav(menuContainer) {
	const MQ = document.body.offsetWidth;
	let headHeight = document.getElementById('sp-header') ? document.getElementById('sp-header').offsetHeight : 0;
	const links = menuContainer.querySelectorAll('a[href^="#"]');
	const windowHeight = document.querySelector('.window-height');
	const scrollContent = (windowHeight && MQ >= 1200) ? document.querySelector('.content-inner') : window;
	// for scroll
	Array.from(links).forEach(function (link, i) {
		if(link.getAttribute('href') !== '#'){
			const elementId = link.getAttribute('href').replace('#', '');
			const element = document.getElementById(elementId);
			let scrollOffset = headHeight + 3; // + 3 is for fix double or none active class
			let elementOffset = element.offsetTop - 3;
			if(windowHeight && MQ >= 1200){
				scrollOffset = 0;
			}

			const sidebarExists = document.querySelector('.sidebar');
			let startElement = sidebarExists && windowHeight && MQ >= 1200 ? 1 : 0;

			activeMenuElement(); // execute in load before scrolling.

			function activeMenuElement() {
				if(windowHeight && MQ >= 1200){
					const scrollPosition = document.querySelector('.content-inner').scrollY || document.querySelector('.content-inner').scrollTop;
					if(elementOffset <= scrollPosition && elementOffset + element.clientHeight > scrollPosition && i >= startElement){
						link.parentElement.classList.add('active');
					} else {
						link.parentElement.classList.remove('active');
					}
				} else {
					const elementTopRect = element.getBoundingClientRect().top;
					if(elementTopRect - scrollOffset <= 0 && elementTopRect + element.clientHeight - scrollOffset > 0 && i >= startElement){
						links.forEach(function (anchor) {
							anchor.parentElement.classList.remove('active');
						});
						link.parentElement.classList.add('active');
					}

					// active first link in load and scroll up and not window height
					if(document.querySelector('.siber-content-wrapper').getBoundingClientRect().top >= 90 && i === startElement){
						links.forEach(function (anchor) {
							anchor.parentElement.classList.remove('active');
						});
						link.parentElement.classList.add('active');
					}
				}
			}

			scrollContent.addEventListener('scroll', function () {
				activeMenuElement();
			});
		}
	});
	// for click
	Array.from(links).forEach(function (link) {
		if(link.getAttribute('href') !== '#'){
			return link.addEventListener('click', function (e) {
				e.preventDefault();
				const elementId = link.getAttribute('href').replace('#', '');
				const element = document.getElementById(elementId);
				// stack 49820013
				let bodyRect = document.body.getBoundingClientRect().top;
				let elementRect = element.getBoundingClientRect().top;

				if (windowHeight && MQ >= 1200) {
					bodyRect = document.querySelector('.content-inner').offsetTop;// stack 14563293
					elementRect = document.getElementById(elementId).offsetTop;
					headHeight = -20;
				}

				const elementPosition = elementRect - bodyRect;
				const offsetPosition = elementPosition - headHeight;
				scrollContent.scrollTo({
					top: offsetPosition,
					behavior: "smooth"
				});
				menuActive = menuContainer.querySelector('.active');
				if (menuActive) {
					menuContainer.querySelector('.active').classList.remove('active');
				}
				link.parentElement.classList.add('active');
			});
		}
	});
}	

// update --scroll_width
function getScroll() {
	const sidebar = document.querySelector('.sidebar-inner');
	if (sidebar) {
		const getScrollW = sidebar.offsetWidth - sidebar.clientWidth;
		const cssScrollW = document.documentElement.style.setProperty('--scroll_width', '-'+getScrollW+'px');
	}
}