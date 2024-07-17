if exists('g:loaded_vim_spotify')
  finish
endif
let g:loaded_vim_spotify = 1

let s:plugin_name = 'spotify'

function! s:call_denops(fn_name, args)
	return denops#request(s:plugin_name, a:fn_name, a:args)
endfunction

function! spotify#nowplaying() abort
	return s:call_denops('nowplaying', [])
endfunction

function! spotify#pause() abort
	return s:call_denops('pause', [])
endfunction

function! spotify#resume() abort
	return s:call_denops('resume', [])
endfunction

function! spotify#next() abort
	return s:call_denops('next', [])
endfunction

function! spotify#previous() abort
	return s:call_denops('previous', [])
endfunction

function! spotify#auth() abort
	return s:call_denops('auth', [])
endfunction

function! spotify#playbackState() abort
	return s:call_denops('playbackState', [])
endfunction

function! spotify#availableDevices() abort
	return s:call_denops('availableDevices', [])
endfunction
