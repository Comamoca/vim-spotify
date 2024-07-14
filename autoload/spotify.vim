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
