
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity$2 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity$2, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    /* src\components\Header.svelte generated by Svelte v3.46.4 */

    const file$v = "src\\components\\Header.svelte";

    function create_fragment$w(ctx) {
    	let header;
    	let h1;
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			a = element("a");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/TSPQ_Logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "TSP Quantum Logo");
    			attr_dev(img, "class", "svelte-y0dgox");
    			add_location(img, file$v, 3, 7, 62);
    			attr_dev(a, "href", "http://platzhalter.de");
    			add_location(a, file$v, 2, 4, 22);
    			attr_dev(h1, "class", "svelte-y0dgox");
    			add_location(h1, file$v, 1, 2, 12);
    			attr_dev(header, "class", "svelte-y0dgox");
    			add_location(header, file$v, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, a);
    			append_dev(a, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src\components\Impressum.svelte generated by Svelte v3.46.4 */

    const file$u = "src\\components\\Impressum.svelte";

    function create_fragment$v(ctx) {
    	let div0;
    	let h20;
    	let t1;
    	let h30;
    	let t3;
    	let p0;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let t7;
    	let h31;
    	let t9;
    	let p1;
    	let t10;
    	let br2;
    	let t11;
    	let t12;
    	let hr;
    	let t13;
    	let div1;
    	let h21;
    	let t15;
    	let h32;
    	let t17;
    	let p2;
    	let t18;
    	let br3;
    	let t19;
    	let br4;
    	let t20;
    	let t21;
    	let h33;
    	let t23;
    	let p3;
    	let t25;
    	let h34;
    	let t27;
    	let ul0;
    	let li0;
    	let t29;
    	let li1;
    	let t31;
    	let li2;
    	let t33;
    	let li3;
    	let t35;
    	let li4;
    	let t37;
    	let h35;
    	let t39;
    	let ul1;
    	let li5;
    	let t41;
    	let li6;
    	let t43;
    	let h36;
    	let t45;
    	let ul2;
    	let li7;
    	let t47;
    	let li8;
    	let t49;
    	let li9;
    	let t51;
    	let h37;
    	let t53;
    	let p4;
    	let t55;
    	let ul3;
    	let li10;
    	let strong0;
    	let t57;
    	let t58;
    	let li11;
    	let strong1;
    	let t60;
    	let t61;
    	let li12;
    	let strong2;
    	let t63;
    	let t64;
    	let p5;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Imprint";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Tamas Nemes";
    			t3 = space();
    			p0 = element("p");
    			t4 = text("Reichsstraße 22");
    			br0 = element("br");
    			t5 = text("93055 Regensburg");
    			br1 = element("br");
    			t6 = text("Deutschland");
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Contact";
    			t9 = space();
    			p1 = element("p");
    			t10 = text("Tel.: +49 941 46290674");
    			br2 = element("br");
    			t11 = text("Email: guidewalk.geraet@gmail.com");
    			t12 = space();
    			hr = element("hr");
    			t13 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Privacy policy";
    			t15 = space();
    			h32 = element("h3");
    			h32.textContent = "Einleitung";
    			t17 = space();
    			p2 = element("p");
    			t18 = text("Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären,\r\n    welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als\r\n    \"Daten“ bezeichnet) wir zu welchen Zwecken und in welchem Umfang im Rahmen\r\n    der Bereitstellung unserer Applikation verarbeiten.");
    			br3 = element("br");
    			t19 = text("Die verwendeten\r\n    Begriffe sind nicht geschlechtsspezifisch.");
    			br4 = element("br");
    			t20 = text("Stand: 28. Februar 2022");
    			t21 = space();
    			h33 = element("h3");
    			h33.textContent = "Übersicht der Verarbeitungen";
    			t23 = space();
    			p3 = element("p");
    			p3.textContent = "Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die\r\n    Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen\r\n    Personen.";
    			t25 = space();
    			h34 = element("h3");
    			h34.textContent = "Arten der verarbeiteten Daten";
    			t27 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Bestandsdaten.";
    			t29 = space();
    			li1 = element("li");
    			li1.textContent = "Kontaktdaten.";
    			t31 = space();
    			li2 = element("li");
    			li2.textContent = "Inhaltsdaten.";
    			t33 = space();
    			li3 = element("li");
    			li3.textContent = "Nutzungsdaten.";
    			t35 = space();
    			li4 = element("li");
    			li4.textContent = "Meta-/Kommunikationsdaten.";
    			t37 = space();
    			h35 = element("h3");
    			h35.textContent = "Kategorien betroffener Nutzer";
    			t39 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "Kommunikationspartner.";
    			t41 = space();
    			li6 = element("li");
    			li6.textContent = "Nutzer.";
    			t43 = space();
    			h36 = element("h3");
    			h36.textContent = "Zwecke der Verarbeitung";
    			t45 = space();
    			ul2 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Erbringung vertraglicher Leistungen und Kundenservice.";
    			t47 = space();
    			li8 = element("li");
    			li8.textContent = "Kontaktanfragen und Kommunikation.";
    			t49 = space();
    			li9 = element("li");
    			li9.textContent = "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.";
    			t51 = space();
    			h37 = element("h3");
    			h37.textContent = "Maßgebliche Rechtsgrundlagen";
    			t53 = space();
    			p4 = element("p");
    			p4.textContent = "Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf\r\n    deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur\r\n    Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben\r\n    in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten ferner im\r\n    Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen\r\n    diese in der Datenschutzerklärung mit.";
    			t55 = space();
    			ul3 = element("ul");
    			li10 = element("li");
    			strong0 = element("strong");
    			strong0.textContent = "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit.\r\n        b. DSGVO)";
    			t57 = text(" - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei\r\n      die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen\r\n      erforderlich, die auf Anfrage der betroffenen Person erfolgen.");
    			t58 = space();
    			li11 = element("li");
    			strong1 = element("strong");
    			strong1.textContent = "Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO)";
    			t60 = text(" - Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich,\r\n      der der Verantwortliche unterliegt.");
    			t61 = space();
    			li12 = element("li");
    			strong2 = element("strong");
    			strong2.textContent = "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO)";
    			t63 = text("\r\n      - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen\r\n      oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte\r\n      und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener\r\n      Daten erfordern, überwiegen.");
    			t64 = space();
    			p5 = element("p");
    			p5.textContent = "Zusätzlich zu den Datenschutzregelungen der Datenschutz-Grundverordnung\r\n    gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört\r\n    insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten\r\n    bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält\r\n    insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf\r\n    Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien\r\n    personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur\r\n    Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall\r\n    einschließlich Profiling. Des Weiteren regelt es die Datenverarbeitung für\r\n    Zwecke des Beschäftigungsverhältnisses (§ 26 BDSG), insbesondere im Hinblick\r\n    auf die Begründung, Durchführung oder Beendigung von\r\n    Beschäftigungsverhältnissen sowie die Einwilligung von Beschäftigten. Ferner\r\n    können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung\r\n    gelangen.";
    			add_location(h20, file$u, 4, 2, 48);
    			attr_dev(h30, "class", "svelte-s1tcy2");
    			add_location(h30, file$u, 5, 2, 68);
    			add_location(br0, file$u, 6, 20, 110);
    			add_location(br1, file$u, 6, 42, 132);
    			attr_dev(p0, "class", "svelte-s1tcy2");
    			add_location(p0, file$u, 6, 2, 92);
    			attr_dev(h31, "class", "svelte-s1tcy2");
    			add_location(h31, file$u, 7, 2, 157);
    			add_location(br2, file$u, 8, 27, 202);
    			attr_dev(p1, "class", "svelte-s1tcy2");
    			add_location(p1, file$u, 8, 2, 177);
    			attr_dev(div0, "class", "imprint svelte-s1tcy2");
    			add_location(div0, file$u, 3, 0, 23);
    			attr_dev(hr, "class", "svelte-s1tcy2");
    			add_location(hr, file$u, 10, 0, 255);
    			add_location(h21, file$u, 12, 2, 292);
    			add_location(h32, file$u, 13, 2, 319);
    			add_location(br3, file$u, 18, 55, 636);
    			add_location(br4, file$u, 19, 46, 705);
    			add_location(p2, file$u, 14, 2, 342);
    			add_location(h33, file$u, 21, 2, 746);
    			add_location(p3, file$u, 22, 2, 787);
    			add_location(h34, file$u, 27, 2, 970);
    			add_location(li0, file$u, 29, 4, 1022);
    			add_location(li1, file$u, 30, 4, 1051);
    			add_location(li2, file$u, 31, 4, 1079);
    			add_location(li3, file$u, 32, 4, 1107);
    			add_location(li4, file$u, 33, 4, 1136);
    			add_location(ul0, file$u, 28, 2, 1012);
    			add_location(h35, file$u, 35, 2, 1184);
    			add_location(li5, file$u, 37, 4, 1236);
    			add_location(li6, file$u, 38, 4, 1273);
    			add_location(ul1, file$u, 36, 2, 1226);
    			add_location(h36, file$u, 40, 2, 1302);
    			add_location(li7, file$u, 42, 4, 1348);
    			add_location(li8, file$u, 43, 4, 1417);
    			add_location(li9, file$u, 44, 4, 1466);
    			add_location(ul2, file$u, 41, 2, 1338);
    			add_location(h37, file$u, 46, 2, 1552);
    			add_location(p4, file$u, 47, 2, 1593);
    			add_location(strong0, file$u, 57, 6, 2074);
    			add_location(li10, file$u, 56, 4, 2062);
    			add_location(strong1, file$u, 65, 6, 2460);
    			add_location(li11, file$u, 64, 4, 2448);
    			add_location(strong2, file$u, 71, 6, 2709);
    			add_location(li12, file$u, 70, 4, 2697);
    			add_location(ul3, file$u, 55, 2, 2052);
    			add_location(p5, file$u, 78, 2, 3103);
    			attr_dev(div1, "class", "privacypolicy");
    			add_location(div1, file$u, 11, 0, 261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h20);
    			append_dev(div0, t1);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(p0, t4);
    			append_dev(p0, br0);
    			append_dev(p0, t5);
    			append_dev(p0, br1);
    			append_dev(p0, t6);
    			append_dev(div0, t7);
    			append_dev(div0, h31);
    			append_dev(div0, t9);
    			append_dev(div0, p1);
    			append_dev(p1, t10);
    			append_dev(p1, br2);
    			append_dev(p1, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h21);
    			append_dev(div1, t15);
    			append_dev(div1, h32);
    			append_dev(div1, t17);
    			append_dev(div1, p2);
    			append_dev(p2, t18);
    			append_dev(p2, br3);
    			append_dev(p2, t19);
    			append_dev(p2, br4);
    			append_dev(p2, t20);
    			append_dev(div1, t21);
    			append_dev(div1, h33);
    			append_dev(div1, t23);
    			append_dev(div1, p3);
    			append_dev(div1, t25);
    			append_dev(div1, h34);
    			append_dev(div1, t27);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t29);
    			append_dev(ul0, li1);
    			append_dev(ul0, t31);
    			append_dev(ul0, li2);
    			append_dev(ul0, t33);
    			append_dev(ul0, li3);
    			append_dev(ul0, t35);
    			append_dev(ul0, li4);
    			append_dev(div1, t37);
    			append_dev(div1, h35);
    			append_dev(div1, t39);
    			append_dev(div1, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t41);
    			append_dev(ul1, li6);
    			append_dev(div1, t43);
    			append_dev(div1, h36);
    			append_dev(div1, t45);
    			append_dev(div1, ul2);
    			append_dev(ul2, li7);
    			append_dev(ul2, t47);
    			append_dev(ul2, li8);
    			append_dev(ul2, t49);
    			append_dev(ul2, li9);
    			append_dev(div1, t51);
    			append_dev(div1, h37);
    			append_dev(div1, t53);
    			append_dev(div1, p4);
    			append_dev(div1, t55);
    			append_dev(div1, ul3);
    			append_dev(ul3, li10);
    			append_dev(li10, strong0);
    			append_dev(li10, t57);
    			append_dev(ul3, t58);
    			append_dev(ul3, li11);
    			append_dev(li11, strong1);
    			append_dev(li11, t60);
    			append_dev(ul3, t61);
    			append_dev(ul3, li12);
    			append_dev(li12, strong2);
    			append_dev(li12, t63);
    			append_dev(div1, t64);
    			append_dev(div1, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Impressum', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Impressum> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Impressum extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Impressum",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    /* src\components\Footer.svelte generated by Svelte v3.46.4 */
    const file$t = "src\\components\\Footer.svelte";

    function create_fragment$u(ctx) {
    	let footer;
    	let div0;
    	let t0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let div1;
    	let a4;
    	let span0;
    	let t9;
    	let a5;
    	let span1;
    	let t10;
    	let a6;
    	let span2;
    	let t11;
    	let a7;
    	let span3;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div0 = element("div");
    			t0 = text("Copyright 2022 © Tamas Nemes. Created with ");
    			a0 = element("a");
    			a0.textContent = "Svelte";
    			t2 = text("\r\n    |\r\n    ");
    			a1 = element("a");
    			a1.textContent = "D3.js";
    			t4 = text("\r\n    |\r\n    ");
    			a2 = element("a");
    			a2.textContent = "FontAwesome";
    			t6 = text("\r\n    |\r\n    ");
    			a3 = element("a");
    			a3.textContent = "MathJax";
    			t8 = space();
    			div1 = element("div");
    			a4 = element("a");
    			span0 = element("span");
    			t9 = space();
    			a5 = element("a");
    			span1 = element("span");
    			t10 = space();
    			a6 = element("a");
    			span2 = element("span");
    			t11 = space();
    			a7 = element("a");
    			span3 = element("span");
    			attr_dev(a0, "href", "https://svelte.dev/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			attr_dev(a0, "class", "svelte-u3ca9r");
    			add_location(a0, file$t, 12, 51, 316);
    			attr_dev(a1, "href", "https://d3js.org/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			attr_dev(a1, "class", "svelte-u3ca9r");
    			add_location(a1, file$t, 18, 4, 438);
    			attr_dev(a2, "href", "https://fontawesome.com/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			attr_dev(a2, "class", "svelte-u3ca9r");
    			add_location(a2, file$t, 22, 4, 544);
    			attr_dev(a3, "href", "https://www.mathjax.org/");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			attr_dev(a3, "class", "svelte-u3ca9r");
    			add_location(a3, file$t, 26, 4, 663);
    			attr_dev(div0, "class", "copyright svelte-u3ca9r");
    			add_location(div0, file$t, 11, 2, 240);
    			attr_dev(span0, "class", "fa fa-github svelte-u3ca9r");
    			add_location(span0, file$t, 34, 32, 907);
    			attr_dev(a4, "href", "https://github.com/Totemi1324");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener noreferrer");
    			add_location(a4, file$t, 31, 4, 804);
    			attr_dev(span1, "class", "fa fa-youtube svelte-u3ca9r");
    			add_location(span1, file$t, 39, 32, 1082);
    			attr_dev(a5, "href", "https://www.youtube.com/channel/UCy364Kb1nLAqbNyRjQZNVqw");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener noreferrer");
    			add_location(a5, file$t, 36, 4, 952);
    			attr_dev(span2, "class", "fa fa-twitter svelte-u3ca9r");
    			add_location(span2, file$t, 44, 32, 1237);
    			attr_dev(a6, "href", "https://twitter.com/LightcraftStud1");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener noreferrer");
    			add_location(a6, file$t, 41, 4, 1128);
    			attr_dev(span3, "class", "fa fa-linkedin svelte-u3ca9r");
    			add_location(span3, file$t, 49, 32, 1407);
    			attr_dev(a7, "href", "https://www.linkedin.com/in/tamas-nemes-459950175/");
    			attr_dev(a7, "target", "_blank");
    			attr_dev(a7, "rel", "noopener noreferrer");
    			add_location(a7, file$t, 46, 4, 1283);
    			attr_dev(div1, "class", "icons");
    			add_location(div1, file$t, 30, 2, 779);
    			attr_dev(footer, "class", "svelte-u3ca9r");
    			add_location(footer, file$t, 10, 0, 228);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div0, a3);
    			append_dev(footer, t8);
    			append_dev(footer, div1);
    			append_dev(div1, a4);
    			append_dev(a4, span0);
    			append_dev(div1, t9);
    			append_dev(div1, a5);
    			append_dev(a5, span1);
    			append_dev(div1, t10);
    			append_dev(div1, a6);
    			append_dev(a6, span2);
    			append_dev(div1, t11);
    			append_dev(div1, a7);
    			append_dev(a7, span3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const { open } = getContext('simple-modal');

    	const openModal = () => {
    		open(Impressum);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Impressum, getContext, open, openModal });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity$2, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\shared\Link.svelte generated by Svelte v3.46.4 */
    const file$s = "src\\shared\\Link.svelte";

    // (36:2) {:else}
    function create_else_block$4(ctx) {
    	let a;
    	let t;
    	let i;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			t = space();
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-up-right-from-square svelte-ugiicu");
    			add_location(i, file$s, 36, 30, 789);
    			attr_dev(a, "href", /*target*/ ctx[0]);
    			attr_dev(a, "class", "svelte-ugiicu");
    			add_location(a, file$s, 36, 4, 763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			append_dev(a, t);
    			append_dev(a, i);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*target*/ 1) {
    				attr_dev(a, "href", /*target*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(36:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#if newPage}
    function create_if_block$9(ctx) {
    	let a;
    	let t;
    	let i;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			t = space();
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-up-right-from-square svelte-ugiicu");
    			add_location(i, file$s, 33, 16, 690);
    			attr_dev(a, "href", /*target*/ ctx[0]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-ugiicu");
    			add_location(a, file$s, 27, 4, 531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			append_dev(a, t);
    			append_dev(a, i);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "mouseenter", /*onEnter*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseleave", /*onLeave*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*target*/ 1) {
    				attr_dev(a, "href", /*target*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(27:2) {#if newPage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div0;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*newPage*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block.c();
    			t = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "underline svelte-ugiicu");
    			set_style(div0, "width", /*$tweenedPercent*/ ctx[2] + "%");
    			add_location(div0, file$s, 38, 2, 852);
    			attr_dev(div1, "class", "link svelte-ugiicu");
    			add_location(div1, file$s, 25, 0, 490);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, t);
    			}

    			if (!current || dirty & /*$tweenedPercent*/ 4) {
    				set_style(div0, "width", /*$tweenedPercent*/ ctx[2] + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let percentValue;
    	let $tweenedPercent;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { target } = $$props;
    	let { newPage = true } = $$props;
    	let percent = 0;

    	//tweened value
    	const tweenedPercent = tweened(0, { duration: 400, easing: cubicOut });

    	validate_store(tweenedPercent, 'tweenedPercent');
    	component_subscribe($$self, tweenedPercent, value => $$invalidate(2, $tweenedPercent = value));

    	const onEnter = () => {
    		$$invalidate(6, percent = 1);
    	};

    	const onLeave = () => {
    		$$invalidate(6, percent = 0);
    	};

    	const writable_props = ['target', 'newPage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('target' in $$props) $$invalidate(0, target = $$props.target);
    		if ('newPage' in $$props) $$invalidate(1, newPage = $$props.newPage);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		cubicOut,
    		target,
    		newPage,
    		percent,
    		tweenedPercent,
    		onEnter,
    		onLeave,
    		percentValue,
    		$tweenedPercent
    	});

    	$$self.$inject_state = $$props => {
    		if ('target' in $$props) $$invalidate(0, target = $$props.target);
    		if ('newPage' in $$props) $$invalidate(1, newPage = $$props.newPage);
    		if ('percent' in $$props) $$invalidate(6, percent = $$props.percent);
    		if ('percentValue' in $$props) $$invalidate(7, percentValue = $$props.percentValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*percent*/ 64) {
    			//reactive
    			$$invalidate(7, percentValue = percent * 100);
    		}

    		if ($$self.$$.dirty & /*percentValue*/ 128) {
    			tweenedPercent.set(percentValue);
    		}
    	};

    	return [
    		target,
    		newPage,
    		$tweenedPercent,
    		tweenedPercent,
    		onEnter,
    		onLeave,
    		percent,
    		percentValue,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { target: 0, newPage: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*target*/ ctx[0] === undefined && !('target' in props)) {
    			console.warn("<Link> was created without expected prop 'target'");
    		}
    	}

    	get target() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get newPage() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newPage(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\shared\Card.svelte generated by Svelte v3.46.4 */

    const file$r = "src\\shared\\Card.svelte";

    function create_fragment$s(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-1137ul");
    			add_location(div, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\shared\Button.svelte generated by Svelte v3.46.4 */

    const file$q = "src\\shared\\Button.svelte";

    function create_fragment$r(ctx) {
    	let button;
    	let span;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-184syiq");
    			add_location(span, file$q, 7, 2, 188);
    			attr_dev(button, "class", button_class_value = "" + (/*type*/ ctx[0] + " unselectable" + " svelte-184syiq"));
    			toggle_class(button, "flat", /*flat*/ ctx[1]);
    			toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			add_location(button, file$q, 6, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (/*type*/ ctx[0] + " unselectable" + " svelte-184syiq"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*type, flat*/ 3) {
    				toggle_class(button, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*type, inverse*/ 5) {
    				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = "primary" } = $$props;
    	let { flat = false } = $$props;
    	let { inverse = false } = $$props;
    	const writable_props = ['type', 'flat', 'inverse'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, flat, inverse });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, flat, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\shared\Lesson.svelte generated by Svelte v3.46.4 */

    function create_fragment$q(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lesson', slots, []);
    	let { component } = $$props;

    	onMount(() => {
    		let script = document.createElement("script");
    		script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    		script.id = "mj";
    		document.head.append(script);

    		script.onload = () => {
    			MathJax = {
    				tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
    				svg: { fontCache: "global" }
    			};
    		};
    	});

    	onDestroy(() => {
    		let script = document.getElementById("mj");
    		script.remove();
    		let styles = document.getElementsByTagName("style"), index;

    		for (index = styles.length - 1; index >= 0; index--) {
    			if (styles[index].getAttribute("type") === "text/css" || styles[index].getAttribute("id") === "MJX-SVG-styles" || styles[index].innerHTML === "") {
    				styles[index].parentNode.removeChild(styles[index]);
    			}
    		}
    	});

    	const writable_props = ['component'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lesson> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    	};

    	$$self.$capture_state = () => ({ onMount, onDestroy, component });

    	$$self.$inject_state = $$props => {
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [component];
    }

    class Lesson extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lesson",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*component*/ ctx[0] === undefined && !('component' in props)) {
    			console.warn("<Lesson> was created without expected prop 'component'");
    		}
    	}

    	get component() {
    		throw new Error("<Lesson>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Lesson>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LessonDetails.svelte generated by Svelte v3.46.4 */
    const file$p = "src\\components\\LessonDetails.svelte";

    // (21:6) <Button flat={true} inverse={true} on:click={openModal}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(21:6) <Button flat={true} inverse={true} on:click={openModal}>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Card>
    function create_default_slot$b(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t1_value = /*lesson*/ ctx[0].title + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*lesson*/ ctx[0].desc + "";
    	let t3;
    	let t4;
    	let div0;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				flat: true,
    				inverse: true,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*openModal*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*lesson*/ ctx[0].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "unselectable svelte-sv8zhi");
    			add_location(img, file$p, 16, 4, 400);
    			attr_dev(h3, "class", "svelte-sv8zhi");
    			add_location(h3, file$p, 17, 4, 458);
    			attr_dev(p, "class", "svelte-sv8zhi");
    			add_location(p, file$p, 18, 4, 487);
    			attr_dev(div0, "class", "start svelte-sv8zhi");
    			add_location(div0, file$p, 19, 4, 513);
    			attr_dev(div1, "class", "lesson");
    			add_location(div1, file$p, 15, 2, 374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*lesson*/ 1 && !src_url_equal(img.src, img_src_value = /*lesson*/ ctx[0].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*lesson*/ 1) && t1_value !== (t1_value = /*lesson*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*lesson*/ 1) && t3_value !== (t3_value = /*lesson*/ ctx[0].desc + "")) set_data_dev(t3, t3_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(15:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, lesson*/ 9) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LessonDetails', slots, []);
    	const { open } = getContext('simple-modal');

    	const openModal = () => {
    		open(Lesson, { component: lesson.component });
    	};

    	let { lesson } = $$props;
    	const writable_props = ['lesson'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LessonDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lesson' in $$props) $$invalidate(0, lesson = $$props.lesson);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		Button,
    		Lesson,
    		getContext,
    		open,
    		openModal,
    		lesson
    	});

    	$$self.$inject_state = $$props => {
    		if ('lesson' in $$props) $$invalidate(0, lesson = $$props.lesson);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lesson, openModal];
    }

    class LessonDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { lesson: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LessonDetails",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lesson*/ ctx[0] === undefined && !('lesson' in props)) {
    			console.warn("<LessonDetails> was created without expected prop 'lesson'");
    		}
    	}

    	get lesson() {
    		throw new Error("<LessonDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lesson(value) {
    		throw new Error("<LessonDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\lessons\TSPIntroduction.svelte generated by Svelte v3.46.4 */
    const file$o = "src\\components\\lessons\\TSPIntroduction.svelte";

    // (40:8) <Link target="https://de.wikipedia.org/wiki/Liste_der_Gro%C3%9Fst%C3%A4dte_in_Deutschland" newPage={true}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://de.wikipedia.org/wiki/Liste_der_Gro%C3%9Fst%C3%A4dte_in_Deutschland");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(40:8) <Link target=\\\"https://de.wikipedia.org/wiki/Liste_der_Gro%C3%9Fst%C3%A4dte_in_Deutschland\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (41:8) <Link target="https://en.wikipedia.org/wiki/Travelling_salesman_problem" newPage={true}>
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://en.wikipedia.org/wiki/Travelling_salesman_problem");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(41:8) <Link target=\\\"https://en.wikipedia.org/wiki/Travelling_salesman_problem\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (42:53) <Link target="https://medium.com/analytics-vidhya/optimization-acb996a4623c" newPage={true}>
    function create_default_slot$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://medium.com/analytics-vidhya/optimization-acb996a4623c");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(42:53) <Link target=\\\"https://medium.com/analytics-vidhya/optimization-acb996a4623c\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr0;
    	let t2;
    	let div4;
    	let p0;
    	let t3;
    	let sup0;
    	let t5;
    	let t6;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let p1;
    	let t9;
    	let p2;
    	let strong;
    	let t10;
    	let sup1;
    	let t12;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let p3;
    	let t15;
    	let p4;
    	let t16;
    	let i0;
    	let t18;
    	let i1;
    	let t20;
    	let t21_value = `$$S(n)=\\frac{(n-1)!}{2}$$` + "";
    	let t21;
    	let t22;
    	let span0;
    	let t24;
    	let span1;
    	let t26;
    	let t27;
    	let h30;
    	let t29;
    	let p5;
    	let t30;
    	let i2;
    	let t32;
    	let i3;
    	let t34;
    	let t35;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t36;
    	let p6;
    	let i4;
    	let t37;
    	let sup2;
    	let t39;
    	let hr1;
    	let t40;
    	let div5;
    	let h31;
    	let t42;
    	let ol;
    	let li0;
    	let link0;
    	let t43;
    	let t44;
    	let li1;
    	let link1;
    	let t45;
    	let t46;
    	let li2;
    	let t47;
    	let i5;
    	let t49;
    	let link2;
    	let t50;
    	let current;

    	link0 = new Link({
    			props: {
    				target: "https://de.wikipedia.org/wiki/Liste_der_Gro%C3%9Fst%C3%A4dte_in_Deutschland",
    				newPage: true,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				target: "https://en.wikipedia.org/wiki/Travelling_salesman_problem",
    				newPage: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				target: "https://medium.com/analytics-vidhya/optimization-acb996a4623c",
    				newPage: true,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "An introduction to the Traveling Salesman Problem";
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			div4 = element("div");
    			p0 = element("p");
    			t3 = text("You are the representative of a big company that sends you on a business trip through its main sites. Coincidentally, they are located in the eight largest cities in Germany");
    			sup0 = element("sup");
    			sup0.textContent = "1";
    			t5 = text(". You want to save as much time and money as possible, of course. If you start from Berlin, visit each city exactly once, and then return to Berlin, in what order should you visit the cities to keep the trip as short as possible?");
    			t6 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "That is the question addressed by the Traveling Salesman Problem. Or, put more generally:";
    			t9 = space();
    			p2 = element("p");
    			strong = element("strong");
    			t10 = text("\"Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city?\"");
    			sup1 = element("sup");
    			sup1.textContent = "2";
    			t12 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "In the case of such small tasks, a solution by eye is of course possible: If beelines are taken as the measure of distance, the shortest path would be the one as shown, around the outside. But if you have to visit 20, 50, or even 100 cities, the matter is no longer so simple.";
    			t15 = space();
    			p4 = element("p");
    			t16 = text("The ");
    			i0 = element("i");
    			i0.textContent = "Traveling Salesman Problem";
    			t18 = text(" (or ");
    			i1 = element("i");
    			i1.textContent = "TSP";
    			t20 = text(" for short) can be found in numerous real-world applications, such as supply chain design, pipeline renovation, and crystal structure analysis. Accordingly, a fast and reliable solution method is important. The catch: The number of possible paths, calculated with the formula ");
    			t21 = text(t21_value);
    			t22 = text(" is immense and growing at a huge pace with each added city. In our 8 cities example, we have ");
    			span0 = element("span");
    			span0.textContent = "2520";
    			t24 = text(" possibilities to choose from, but with 12 cities, there are already ");
    			span1 = element("span");
    			span1.textContent = "19.958.400";
    			t26 = text(" different paths. Hence, the problem is NP-hard, basically meaning that an algorithm that finds the exact solution for large inputs in a finite time is likely to be impossible.");
    			t27 = space();
    			h30 = element("h3");
    			h30.textContent = "Why a quantum approach?";
    			t29 = space();
    			p5 = element("p");
    			t30 = text("The TSP is a good example of an \"optimization problem\". Since we can't try all solutions without waiting for decades and can't calculate the best one definitively, we try to approximate it as best as we can. It is possible to find the ");
    			i2 = element("i");
    			i2.textContent = "\"global\" optimum";
    			t32 = text(", the shortest path of all, but we can just as well end up at a ");
    			i3 = element("i");
    			i3.textContent = "\"local\" optimum";
    			t34 = text(", one of the many shorter paths. Quantum annealers, a subset of quantum computers, are made for this task because of the physical properties of qubits. Additionally, traditional optimization algorithms are slow, whereas a quantum annealer finds its solution in mere microseconds. In this course, we will explore how the quantum annealers of D-Wave can handle the TSP and whether we can find better solutions than with traditional methods.");
    			t35 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t36 = space();
    			p6 = element("p");
    			i4 = element("i");
    			t37 = text("How can we find the deepest valley when seeing just one point at a time? An example for optimization problems");
    			sup2 = element("sup");
    			sup2.textContent = "3";
    			t39 = space();
    			hr1 = element("hr");
    			t40 = space();
    			div5 = element("div");
    			h31 = element("h3");
    			h31.textContent = "References";
    			t42 = space();
    			ol = element("ol");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t43 = text(", accessed: 10.03.2022");
    			t44 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t45 = text(", accessed: 10.03.2022");
    			t46 = space();
    			li2 = element("li");
    			t47 = text("Heena Rijhwani, ");
    			i5 = element("i");
    			i5.textContent = "Optimization";
    			t49 = text(", (2020), ");
    			create_component(link2.$$.fragment);
    			t50 = text(", accessed: 10.03.2022");
    			attr_dev(h2, "class", "svelte-v2lwi");
    			add_location(h2, file$o, 5, 2, 94);
    			attr_dev(div0, "class", "title svelte-v2lwi");
    			add_location(div0, file$o, 4, 0, 71);
    			attr_dev(hr0, "class", "svelte-v2lwi");
    			add_location(hr0, file$o, 7, 0, 162);
    			add_location(sup0, file$o, 10, 177, 374);
    			add_location(p0, file$o, 9, 2, 192);
    			attr_dev(img0, "width", "300");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Map.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "A map of Germany with its eight biggest cities marked: Hamburg, Berlin, Düsseldorf, Leipzig, Köln, Frankfurt, Stuttgart, Munich");
    			add_location(img0, file$o, 12, 22, 647);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$o, 12, 2, 627);
    			add_location(p1, file$o, 13, 2, 827);
    			add_location(sup1, file$o, 17, 186, 1155);
    			add_location(strong, file$o, 17, 4, 973);
    			set_style(p2, "text-align", "center");
    			add_location(p2, file$o, 16, 2, 937);
    			attr_dev(img1, "width", "270");
    			if (!src_url_equal(img1.src, img1_src_value = "/img/MapLines.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "The same map as above where the cities are connected in a circular path");
    			add_location(img1, file$o, 19, 28, 1214);
    			set_style(div2, "float", "right");
    			add_location(div2, file$o, 19, 2, 1188);
    			add_location(p3, file$o, 20, 2, 1343);
    			add_location(i0, file$o, 24, 8, 1653);
    			add_location(i1, file$o, 24, 46, 1691);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$o, 24, 456, 2101);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$o, 24, 559, 2204);
    			add_location(p4, file$o, 23, 2, 1640);
    			add_location(h30, file$o, 26, 2, 2432);
    			add_location(i2, file$o, 28, 239, 2712);
    			add_location(i3, file$o, 28, 326, 2799);
    			add_location(p5, file$o, 27, 2, 2468);
    			attr_dev(img2, "width", "400");
    			if (!src_url_equal(img2.src, img2_src_value = "/img/Optimization.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "A hilly landscape with a marked path from the starting point on a hill to the end point in a valley.");
    			add_location(img2, file$o, 30, 22, 3291);
    			attr_dev(div3, "align", "center");
    			add_location(div3, file$o, 30, 2, 3271);
    			add_location(sup2, file$o, 32, 116, 3601);
    			add_location(i4, file$o, 32, 4, 3489);
    			set_style(p6, "text-align", "center");
    			add_location(p6, file$o, 31, 2, 3453);
    			attr_dev(div4, "class", "text");
    			add_location(div4, file$o, 8, 0, 170);
    			attr_dev(hr1, "class", "svelte-v2lwi");
    			add_location(hr1, file$o, 35, 0, 3635);
    			attr_dev(h31, "class", "svelte-v2lwi");
    			add_location(h31, file$o, 37, 2, 3663);
    			add_location(li0, file$o, 39, 4, 3696);
    			add_location(li1, file$o, 40, 4, 3921);
    			add_location(i5, file$o, 41, 24, 4130);
    			add_location(li2, file$o, 41, 4, 4110);
    			add_location(ol, file$o, 38, 2, 3686);
    			attr_dev(div5, "class", "refs svelte-v2lwi");
    			add_location(div5, file$o, 36, 0, 3641);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, p0);
    			append_dev(p0, t3);
    			append_dev(p0, sup0);
    			append_dev(p0, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div4, t7);
    			append_dev(div4, p1);
    			append_dev(div4, t9);
    			append_dev(div4, p2);
    			append_dev(p2, strong);
    			append_dev(strong, t10);
    			append_dev(strong, sup1);
    			append_dev(div4, t12);
    			append_dev(div4, div2);
    			append_dev(div2, img1);
    			append_dev(div4, t13);
    			append_dev(div4, p3);
    			append_dev(div4, t15);
    			append_dev(div4, p4);
    			append_dev(p4, t16);
    			append_dev(p4, i0);
    			append_dev(p4, t18);
    			append_dev(p4, i1);
    			append_dev(p4, t20);
    			append_dev(p4, t21);
    			append_dev(p4, t22);
    			append_dev(p4, span0);
    			append_dev(p4, t24);
    			append_dev(p4, span1);
    			append_dev(p4, t26);
    			append_dev(div4, t27);
    			append_dev(div4, h30);
    			append_dev(div4, t29);
    			append_dev(div4, p5);
    			append_dev(p5, t30);
    			append_dev(p5, i2);
    			append_dev(p5, t32);
    			append_dev(p5, i3);
    			append_dev(p5, t34);
    			append_dev(div4, t35);
    			append_dev(div4, div3);
    			append_dev(div3, img2);
    			append_dev(div4, t36);
    			append_dev(div4, p6);
    			append_dev(p6, i4);
    			append_dev(i4, t37);
    			append_dev(i4, sup2);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t40, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h31);
    			append_dev(div5, t42);
    			append_dev(div5, ol);
    			append_dev(ol, li0);
    			mount_component(link0, li0, null);
    			append_dev(li0, t43);
    			append_dev(ol, t44);
    			append_dev(ol, li1);
    			mount_component(link1, li1, null);
    			append_dev(li1, t45);
    			append_dev(ol, t46);
    			append_dev(ol, li2);
    			append_dev(li2, t47);
    			append_dev(li2, i5);
    			append_dev(li2, t49);
    			mount_component(link2, li2, null);
    			append_dev(li2, t50);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t40);
    			if (detaching) detach_dev(div5);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TSPIntroduction', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TSPIntroduction> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class TSPIntroduction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TSPIntroduction",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\shared\Graph.svelte generated by Svelte v3.46.4 */

    const file$n = "src\\shared\\Graph.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (30:4) {:else}
    function create_else_block$3(ctx) {
    	let g;
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*link*/ ctx[9].source[0]);
    			attr_dev(line, "y1", line_y__value = /*link*/ ctx[9].source[1]);
    			attr_dev(line, "x2", line_x__value_1 = /*link*/ ctx[9].target[0]);
    			attr_dev(line, "y2", line_y__value_1 = /*link*/ ctx[9].target[1]);
    			add_location(line, file$n, 31, 8, 801);
    			attr_dev(g, "stroke", "#999");
    			attr_dev(g, "stroke-opacity", "0.6");
    			attr_dev(g, "stroke-width", "2");
    			add_location(g, file$n, 30, 6, 736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 16 && line_x__value !== (line_x__value = /*link*/ ctx[9].source[0])) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*links*/ 16 && line_y__value !== (line_y__value = /*link*/ ctx[9].source[1])) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*links*/ 16 && line_x__value_1 !== (line_x__value_1 = /*link*/ ctx[9].target[0])) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*links*/ 16 && line_y__value_1 !== (line_y__value_1 = /*link*/ ctx[9].target[1])) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(30:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if link.highlight}
    function create_if_block$8(ctx) {
    	let g;
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*link*/ ctx[9].source[0]);
    			attr_dev(line, "y1", line_y__value = /*link*/ ctx[9].source[1]);
    			attr_dev(line, "x2", line_x__value_1 = /*link*/ ctx[9].target[0]);
    			attr_dev(line, "y2", line_y__value_1 = /*link*/ ctx[9].target[1]);
    			add_location(line, file$n, 22, 8, 562);
    			attr_dev(g, "stroke", "#f1b6e8");
    			attr_dev(g, "stroke-opacity", "0.6");
    			attr_dev(g, "stroke-width", "2");
    			add_location(g, file$n, 21, 6, 494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 16 && line_x__value !== (line_x__value = /*link*/ ctx[9].source[0])) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*links*/ 16 && line_y__value !== (line_y__value = /*link*/ ctx[9].source[1])) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*links*/ 16 && line_x__value_1 !== (line_x__value_1 = /*link*/ ctx[9].target[0])) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*links*/ 16 && line_y__value_1 !== (line_y__value_1 = /*link*/ ctx[9].target[1])) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(21:4) {#if link.highlight}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#each links as link}
    function create_each_block_1$2(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let text_1;
    	let t_value = /*link*/ ctx[9].value + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	function select_block_type(ctx, dirty) {
    		if (/*link*/ ctx[9].highlight) return create_if_block$8;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			rect = svg_element("rect");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(rect, "x", rect_x_value = (/*link*/ ctx[9].source[0] + /*link*/ ctx[9].target[0]) / 2 - 10);
    			attr_dev(rect, "y", rect_y_value = (/*link*/ ctx[9].source[1] + /*link*/ ctx[9].target[1]) / 2 - 10);
    			attr_dev(rect, "width", "22");
    			attr_dev(rect, "height", "12");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$n, 40, 4, 977);
    			attr_dev(text_1, "class", "link unselectable svelte-233k4q");
    			attr_dev(text_1, "x", text_1_x_value = (/*link*/ ctx[9].source[0] + /*link*/ ctx[9].target[0]) / 2);
    			attr_dev(text_1, "y", text_1_y_value = (/*link*/ ctx[9].source[1] + /*link*/ ctx[9].target[1]) / 2);
    			attr_dev(text_1, "text-anchor", "middle");
    			add_location(text_1, file$n, 47, 4, 1161);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, rect, anchor);
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(rect.parentNode, rect);
    				}
    			}

    			if (dirty & /*links*/ 16 && rect_x_value !== (rect_x_value = (/*link*/ ctx[9].source[0] + /*link*/ ctx[9].target[0]) / 2 - 10)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*links*/ 16 && rect_y_value !== (rect_y_value = (/*link*/ ctx[9].source[1] + /*link*/ ctx[9].target[1]) / 2 - 10)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*links*/ 16 && t_value !== (t_value = /*link*/ ctx[9].value + "")) set_data_dev(t, t_value);

    			if (dirty & /*links*/ 16 && text_1_x_value !== (text_1_x_value = (/*link*/ ctx[9].source[0] + /*link*/ ctx[9].target[0]) / 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*links*/ 16 && text_1_y_value !== (text_1_y_value = (/*link*/ ctx[9].source[1] + /*link*/ ctx[9].target[1]) / 2)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(rect);
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(20:2) {#each links as link}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {#each nodes as node}
    function create_each_block$5(ctx) {
    	let circle0;
    	let circle0_cx_value;
    	let circle0_cy_value;
    	let g;
    	let circle1;
    	let title;
    	let t0_value = /*node*/ ctx[6].id + "";
    	let t0;
    	let circle1_cx_value;
    	let circle1_cy_value;
    	let text_1;
    	let t1_value = /*node*/ ctx[6].id + "";
    	let t1;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			circle0 = svg_element("circle");
    			g = svg_element("g");
    			circle1 = svg_element("circle");
    			title = svg_element("title");
    			t0 = text(t0_value);
    			text_1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(circle0, "fill", "white");
    			attr_dev(circle0, "cx", circle0_cx_value = /*node*/ ctx[6].x + nodeRadius * 1.5);
    			attr_dev(circle0, "cy", circle0_cy_value = /*node*/ ctx[6].y - nodeRadius * 1.5 - 5);
    			attr_dev(circle0, "r", "8");
    			add_location(circle0, file$n, 56, 4, 1395);
    			add_location(title, file$n, 65, 8, 1661);
    			attr_dev(circle1, "r", nodeRadius);
    			attr_dev(circle1, "cx", circle1_cx_value = /*node*/ ctx[6].x);
    			attr_dev(circle1, "cy", circle1_cy_value = /*node*/ ctx[6].y);
    			add_location(circle1, file$n, 64, 7, 1604);
    			attr_dev(g, "stroke", "white");
    			attr_dev(g, "stroke-width", "1.5");
    			attr_dev(g, "fill", "url('#nodeGradient')");
    			add_location(g, file$n, 63, 4, 1531);
    			attr_dev(text_1, "class", "unselectable");
    			attr_dev(text_1, "x", text_1_x_value = /*node*/ ctx[6].x + nodeRadius * 1.5);
    			attr_dev(text_1, "y", text_1_y_value = /*node*/ ctx[6].y - nodeRadius * 1.5);
    			attr_dev(text_1, "text-anchor", "middle");
    			add_location(text_1, file$n, 68, 4, 1718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle0, anchor);
    			insert_dev(target, g, anchor);
    			append_dev(g, circle1);
    			append_dev(circle1, title);
    			append_dev(title, t0);
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nodes*/ 8 && circle0_cx_value !== (circle0_cx_value = /*node*/ ctx[6].x + nodeRadius * 1.5)) {
    				attr_dev(circle0, "cx", circle0_cx_value);
    			}

    			if (dirty & /*nodes*/ 8 && circle0_cy_value !== (circle0_cy_value = /*node*/ ctx[6].y - nodeRadius * 1.5 - 5)) {
    				attr_dev(circle0, "cy", circle0_cy_value);
    			}

    			if (dirty & /*nodes*/ 8 && t0_value !== (t0_value = /*node*/ ctx[6].id + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*nodes*/ 8 && circle1_cx_value !== (circle1_cx_value = /*node*/ ctx[6].x)) {
    				attr_dev(circle1, "cx", circle1_cx_value);
    			}

    			if (dirty & /*nodes*/ 8 && circle1_cy_value !== (circle1_cy_value = /*node*/ ctx[6].y)) {
    				attr_dev(circle1, "cy", circle1_cy_value);
    			}

    			if (dirty & /*nodes*/ 8 && t1_value !== (t1_value = /*node*/ ctx[6].id + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*nodes*/ 8 && text_1_x_value !== (text_1_x_value = /*node*/ ctx[6].x + nodeRadius * 1.5)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*nodes*/ 8 && text_1_y_value !== (text_1_y_value = /*node*/ ctx[6].y - nodeRadius * 1.5)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle0);
    			if (detaching) detach_dev(g);
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(56:2) {#each nodes as node}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let svg;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let each0_anchor;
    	let each_value_1 = /*links*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*nodes*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(stop0, "offset", "5%");
    			attr_dev(stop0, "stop-color", "#80f1ef");
    			add_location(stop0, file$n, 14, 6, 308);
    			attr_dev(stop1, "offset", "95%");
    			attr_dev(stop1, "stop-color", "#2eb6e8");
    			add_location(stop1, file$n, 15, 6, 357);
    			attr_dev(linearGradient, "id", "nodeGradient");
    			attr_dev(linearGradient, "gradientTransform", "rotate(45)");
    			add_location(linearGradient, file$n, 13, 4, 235);
    			add_location(defs, file$n, 12, 2, 223);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "style", /*style*/ ctx[2]);
    			add_location(svg, file$n, 11, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(svg, null);
    			}

    			append_dev(svg, each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*links*/ 16) {
    				each_value_1 = /*links*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(svg, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*nodes, nodeRadius*/ 8) {
    				each_value = /*nodes*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*style*/ 4) {
    				attr_dev(svg, "style", /*style*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nodeRadius = 8;

    function instance$n($$self, $$props, $$invalidate) {
    	let links;
    	let nodes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Graph', slots, []);
    	let { graph } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { style } = $$props;
    	const writable_props = ['graph', 'width', 'height', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('graph' in $$props) $$invalidate(5, graph = $$props.graph);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({
    		graph,
    		width,
    		height,
    		style,
    		nodeRadius,
    		nodes,
    		links
    	});

    	$$self.$inject_state = $$props => {
    		if ('graph' in $$props) $$invalidate(5, graph = $$props.graph);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('nodes' in $$props) $$invalidate(3, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(4, links = $$props.links);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*graph*/ 32) {
    			$$invalidate(4, links = graph.links);
    		}

    		if ($$self.$$.dirty & /*graph*/ 32) {
    			$$invalidate(3, nodes = graph.nodes);
    		}
    	};

    	return [width, height, style, nodes, links, graph];
    }

    class Graph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { graph: 5, width: 0, height: 1, style: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*graph*/ ctx[5] === undefined && !('graph' in props)) {
    			console.warn("<Graph> was created without expected prop 'graph'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<Graph> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<Graph> was created without expected prop 'height'");
    		}

    		if (/*style*/ ctx[2] === undefined && !('style' in props)) {
    			console.warn("<Graph> was created without expected prop 'style'");
    		}
    	}

    	get graph() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graph(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //500 x 350

    var data2 = {
    	"nodes": [
    	  	{"id": "A", "x": 26, "y": 44},
    	  	{"id": "B", "x": 458, "y": 27},
    	  	{"id": "C", "x": 90, "y": 169},
    		{"id": "D", "x": 422, "y": 304},
    	],
    	"links": [
    		{"source": [26, 44], "target": [458, 27], "value": 3.3},
            {"source": [26, 44], "target": [90, 169], "value": 2.5},
            {"source": [26, 44], "target": [422, 304], "value": 5.7},
            {"source": [458, 27], "target": [90, 169], "value": 4.1},
            {"source": [458, 27], "target": [422, 304], "value": 5.6},
            {"source": [90, 169], "target": [422, 304], "value": 3.4},
    	]
      };

    /* src\components\lessons\GraphTheory.svelte generated by Svelte v3.46.4 */
    const file$m = "src\\components\\lessons\\GraphTheory.svelte";

    function create_fragment$m(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let p0;
    	let t3;
    	let i0;
    	let t5;
    	let i1;
    	let t7;
    	let i2;
    	let t9;
    	let t10;
    	let p1;
    	let t12;
    	let graph;
    	let t13;
    	let p2;
    	let i3;
    	let t15;
    	let p3;
    	let t16;
    	let i4;
    	let t18;
    	let strong0;
    	let t20;
    	let t21;
    	let p4;
    	let t24;
    	let p5;
    	let t26;
    	let p6;
    	let t32;
    	let p7;
    	let t34;
    	let ul;
    	let li0;
    	let t35;
    	let span0;
    	let t37;
    	let span1;
    	let t39;
    	let span2;
    	let t41;
    	let span3;
    	let t43;
    	let span4;
    	let t45;
    	let t46;
    	let li1;
    	let span5;
    	let t48;
    	let span6;
    	let t50;
    	let t51;
    	let li2;
    	let span7;
    	let t53;
    	let sub0;
    	let t55;
    	let sub1;
    	let t57;
    	let span8;
    	let t59;
    	let sub2;
    	let t61;
    	let sub3;
    	let t63;
    	let sup;
    	let t65;
    	let strong1;
    	let t67;
    	let sub4;
    	let t69;
    	let sub5;
    	let t71;
    	let t72;
    	let li3;
    	let span9;
    	let t74;
    	let t75;
    	let p8;
    	let t82;
    	let p9;
    	let t83;
    	let i5;
    	let t85;
    	let current;

    	graph = new Graph({
    			props: {
    				graph: data2,
    				width: "500",
    				height: "350",
    				style: "display: block; margin: 0 auto;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Graph theory";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t3 = text("Computers only take numbers, so we need to use them as well. We already subconsciously drew a key concept of the solving method with the cities interconnected with lines: ");
    			i0 = element("i");
    			i0.textContent = "Graphs";
    			t5 = text(" are a fundamental part of mathematics, so much so that they have their own field of study called ");
    			i1 = element("i");
    			i1.textContent = "graph theory";
    			t7 = text(". In general, a graph describes a set of cities, called ");
    			i2 = element("i");
    			i2.textContent = "\"vertices\"";
    			t9 = text(", and how they are connected mathematically.");
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "Let's simplify our example from the lecture before to just 4 cities and name them A, B, C, and D.";
    			t12 = space();
    			create_component(graph.$$.fragment);
    			t13 = space();
    			p2 = element("p");
    			i3 = element("i");
    			i3.textContent = "Fully connected graph with 4 vertices";
    			t15 = space();
    			p3 = element("p");
    			t16 = text("Every node is represented as a blue circle connected to the other nodes through ");
    			i4 = element("i");
    			i4.textContent = "\"edges\"";
    			t18 = text(", the distances between the nodes drawn in gray. In our example, every possible pair of vertices is connected, each edge can be traversed in both directions and each edge has a unique distance value assigned to it. This is called a ");
    			strong0 = element("strong");
    			strong0.textContent = "complete undirected weighted graph";
    			t20 = text(". Graphs can have various shapes and types, but in this tutorial, we only focus on this one since it corresponds to the standard definition of the TSP.");
    			t21 = space();
    			p4 = element("p");

    			p4.textContent = `In mathematical terms, a graph like this can be characterized as follows:
    ${`$$G=\\left(V,E,d\\right)$$`}`;

    			t24 = space();
    			p5 = element("p");
    			p5.textContent = "where";
    			t26 = space();
    			p6 = element("p");

    			p6.textContent = `${`$$V=\\left\\{v_1,v_2,...\\right\\}$$`} 
    ${`$$E\\subseteq\\left\\{\\left\\{v_i,v_j\\right\\}|\\left(v_i,v_j\\right)\\in V^2\\wedge v_i\\neq v_j\\right\\}$$`} 
    ${`$$d:E\\to\\mathbb{R}$$`}`;

    			t32 = space();
    			p7 = element("p");
    			p7.textContent = "That was quite a lot at once. Let's go through it step-by-step:";
    			t34 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t35 = text("A graph ");
    			span0 = element("span");
    			span0.textContent = "G";
    			t37 = text(" is a combination of three components: ");
    			span1 = element("span");
    			span1.textContent = "V";
    			t39 = text(", the vertices, ");
    			span2 = element("span");
    			span2.textContent = "E";
    			t41 = text(", the edges, and ");
    			span3 = element("span");
    			span3.textContent = "d";
    			t43 = text(", a distance function. The notation in ");
    			span4 = element("span");
    			span4.textContent = "()";
    			t45 = text(" as a triplet shows that they belong together.");
    			t46 = space();
    			li1 = element("li");
    			span5 = element("span");
    			span5.textContent = "V";
    			t48 = text(" denotes a set of vertices that are part of the graph. Sets are marked by curly braces ");
    			span6 = element("span");
    			span6.textContent = "{}";
    			t50 = text(".");
    			t51 = space();
    			li2 = element("li");
    			span7 = element("span");
    			span7.textContent = "E";
    			t53 = text(" is a set of edges, which are unordered pairs of vertices {v");
    			sub0 = element("sub");
    			sub0.textContent = "i";
    			t55 = text(", v");
    			sub1 = element("sub");
    			sub1.textContent = "j";
    			t57 = text("}. The pipe symbol ");
    			span8 = element("span");
    			span8.textContent = "|";
    			t59 = text(" defines what conditions these pairs must fulfill: Both v");
    			sub2 = element("sub");
    			sub2.textContent = "i";
    			t61 = text(" and v");
    			sub3 = element("sub");
    			sub3.textContent = "j";
    			t63 = text(" must be part of V");
    			sup = element("sup");
    			sup.textContent = "2";
    			t65 = text(" (\"squared\" for sets means the cartesian product, i.e. the set of all possible combinations of a set's elements) ");
    			strong1 = element("strong");
    			strong1.textContent = "and";
    			t67 = text(" v");
    			sub4 = element("sub");
    			sub4.textContent = "i";
    			t69 = text(" must not be equal to v");
    			sub5 = element("sub");
    			sub5.textContent = "j";
    			t71 = text(" to prevent loops.");
    			t72 = space();
    			li3 = element("li");
    			span9 = element("span");
    			span9.textContent = "d";
    			t74 = text(" is a function that maps every edge (i.e. unordered pair of vertices) to a real number, in this case, the distance.");
    			t75 = space();
    			p8 = element("p");

    			p8.textContent = `So, the graph above can be described like this:
    ${`$$V=\\left\\{A,B,C,D\\right\\}$$`} 
    ${`$$E=\\left\\{\\left\\{A,B\\right\\},\\left\\{A,C\\right\\},\\left\\{A,D\\right\\},\\left\\{B,C\\right\\},\\left\\{B,D\\right\\},\\left\\{C,D\\right\\}\\right\\}$$`} 
    ${`$$d:E\\to\\begin{cases}2.5 & \\text{if }E=\\left\\{A,B\\right\\} \\\\ 3.3 & \\text{if }E=\\left\\{A,C\\right\\} \\\\ 5.7 & \\text{if }E=\\left\\{A,D\\right\\} \\\\ 4.1 & \\text{if }E=\\left\\{B,C\\right\\} \\\\ 3.4 & \\text{if }E=\\left\\{B,D\\right\\} \\\\ 5.6 & \\text{if }E=\\left\\{C,D\\right\\}\\end{cases}$$`}`;

    			t82 = space();
    			p9 = element("p");
    			t83 = text("The job of every TSP algorithm is to find a path that visits each vertex exactly once and returns to the starting vertex (also called a ");
    			i5 = element("i");
    			i5.textContent = "closed Hamiltonian cycle";
    			t85 = text(") where the sum of the distances from the distance function is as low as possible. Since the goal is to traverse the graph, the TSP is a \"graph traversal\" problem.");
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$m, 6, 2, 145);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$m, 5, 0, 122);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$m, 8, 0, 176);
    			add_location(i0, file$m, 11, 175, 386);
    			add_location(i1, file$m, 11, 286, 497);
    			add_location(i2, file$m, 11, 361, 572);
    			add_location(p0, file$m, 10, 2, 206);
    			add_location(p1, file$m, 13, 2, 645);
    			add_location(i3, file$m, 18, 4, 890);
    			set_style(p2, "text-align", "center");
    			add_location(p2, file$m, 17, 2, 854);
    			add_location(i4, file$m, 21, 84, 1035);
    			add_location(strong0, file$m, 21, 330, 1281);
    			add_location(p3, file$m, 20, 2, 946);
    			add_location(p4, file$m, 23, 2, 1495);
    			set_style(p5, "text-align", "center");
    			add_location(p5, file$m, 27, 2, 1625);
    			add_location(p6, file$m, 28, 2, 1668);
    			add_location(p7, file$m, 33, 2, 1882);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$m, 37, 16, 1988);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$m, 37, 86, 2058);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$m, 37, 133, 2105);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$m, 37, 181, 2153);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$m, 37, 251, 2223);
    			add_location(li0, file$m, 37, 4, 1976);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$m, 38, 8, 2316);
    			attr_dev(span6, "class", "emphasis");
    			add_location(span6, file$m, 38, 126, 2434);
    			add_location(li1, file$m, 38, 4, 2312);
    			attr_dev(span7, "class", "emphasis");
    			add_location(span7, file$m, 39, 8, 2492);
    			add_location(sub0, file$m, 39, 104, 2588);
    			add_location(sub1, file$m, 39, 119, 2603);
    			attr_dev(span8, "class", "emphasis");
    			add_location(span8, file$m, 39, 155, 2639);
    			add_location(sub2, file$m, 39, 243, 2727);
    			add_location(sub3, file$m, 39, 261, 2745);
    			add_location(sup, file$m, 39, 291, 2775);
    			add_location(strong1, file$m, 39, 416, 2900);
    			add_location(sub4, file$m, 39, 438, 2922);
    			add_location(sub5, file$m, 39, 473, 2957);
    			add_location(li2, file$m, 39, 4, 2488);
    			attr_dev(span9, "class", "emphasis");
    			add_location(span9, file$m, 40, 8, 3002);
    			add_location(li3, file$m, 40, 4, 2998);
    			add_location(ul, file$m, 36, 2, 1966);
    			add_location(p8, file$m, 42, 2, 3166);
    			add_location(i5, file$m, 49, 140, 3916);
    			add_location(p9, file$m, 48, 2, 3771);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$m, 9, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(p0, i0);
    			append_dev(p0, t5);
    			append_dev(p0, i1);
    			append_dev(p0, t7);
    			append_dev(p0, i2);
    			append_dev(p0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, p1);
    			append_dev(div1, t12);
    			mount_component(graph, div1, null);
    			append_dev(div1, t13);
    			append_dev(div1, p2);
    			append_dev(p2, i3);
    			append_dev(div1, t15);
    			append_dev(div1, p3);
    			append_dev(p3, t16);
    			append_dev(p3, i4);
    			append_dev(p3, t18);
    			append_dev(p3, strong0);
    			append_dev(p3, t20);
    			append_dev(div1, t21);
    			append_dev(div1, p4);
    			append_dev(div1, t24);
    			append_dev(div1, p5);
    			append_dev(div1, t26);
    			append_dev(div1, p6);
    			append_dev(div1, t32);
    			append_dev(div1, p7);
    			append_dev(div1, t34);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, t35);
    			append_dev(li0, span0);
    			append_dev(li0, t37);
    			append_dev(li0, span1);
    			append_dev(li0, t39);
    			append_dev(li0, span2);
    			append_dev(li0, t41);
    			append_dev(li0, span3);
    			append_dev(li0, t43);
    			append_dev(li0, span4);
    			append_dev(li0, t45);
    			append_dev(ul, t46);
    			append_dev(ul, li1);
    			append_dev(li1, span5);
    			append_dev(li1, t48);
    			append_dev(li1, span6);
    			append_dev(li1, t50);
    			append_dev(ul, t51);
    			append_dev(ul, li2);
    			append_dev(li2, span7);
    			append_dev(li2, t53);
    			append_dev(li2, sub0);
    			append_dev(li2, t55);
    			append_dev(li2, sub1);
    			append_dev(li2, t57);
    			append_dev(li2, span8);
    			append_dev(li2, t59);
    			append_dev(li2, sub2);
    			append_dev(li2, t61);
    			append_dev(li2, sub3);
    			append_dev(li2, t63);
    			append_dev(li2, sup);
    			append_dev(li2, t65);
    			append_dev(li2, strong1);
    			append_dev(li2, t67);
    			append_dev(li2, sub4);
    			append_dev(li2, t69);
    			append_dev(li2, sub5);
    			append_dev(li2, t71);
    			append_dev(ul, t72);
    			append_dev(ul, li3);
    			append_dev(li3, span9);
    			append_dev(li3, t74);
    			append_dev(div1, t75);
    			append_dev(div1, p8);
    			append_dev(div1, t82);
    			append_dev(div1, p9);
    			append_dev(p9, t83);
    			append_dev(p9, i5);
    			append_dev(p9, t85);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(graph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GraphTheory', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GraphTheory> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Graph, data1: data2 });
    	return [];
    }

    class GraphTheory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphTheory",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\shared\Matrix.svelte generated by Svelte v3.46.4 */

    const file$l = "src\\shared\\Matrix.svelte";

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (74:2) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let each_value_4 = /*data*/ ctx[0];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "matrix svelte-25xnht");
    			set_style(div, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			set_style(div, "grid-template-rows", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			add_location(div, file$l, 74, 4, 2269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, size*/ 3) {
    				each_value_4 = /*data*/ ctx[0];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div, "grid-template-rows", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(74:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if showLabels}
    function create_if_block$7(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1;
    	let div2;
    	let each_value_3 = /*labels_side*/ ctx[5];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*labels_top*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "labels svelte-25xnht");
    			set_style(div0, "grid-template-columns", "1fr");
    			set_style(div0, "grid-template-rows", "repeat(" + (/*data*/ ctx[0].length + 1) + ", 1fr)");
    			add_location(div0, file$l, 22, 6, 688);
    			attr_dev(div1, "class", "labels svelte-25xnht");
    			set_style(div1, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			set_style(div1, "grid-template-rows", "1fr");
    			add_location(div1, file$l, 42, 8, 1275);
    			attr_dev(div2, "class", "matrix svelte-25xnht");
    			set_style(div2, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			set_style(div2, "grid-template-rows", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			add_location(div2, file$l, 55, 8, 1687);
    			attr_dev(div3, "class", "labels svelte-25xnht");
    			set_style(div3, "grid-template-columns", "1fr");
    			set_style(div3, "grid-template-rows", /*size*/ ctx[1] * 0.2 + "px 1fr");
    			add_location(div3, file$l, 37, 6, 1133);
    			attr_dev(div4, "class", "labels svelte-25xnht");
    			set_style(div4, "grid-template-columns", /*size*/ ctx[1] * 0.2 + "px 1fr");
    			set_style(div4, "grid-template-rows", "1fr");
    			add_location(div4, file$l, 18, 4, 565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, data, labels_side*/ 35) {
    				each_value_3 = /*labels_side*/ ctx[5];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div0, "grid-template-rows", "repeat(" + (/*data*/ ctx[0].length + 1) + ", 1fr)");
    			}

    			if (dirty & /*size, labels_top*/ 18) {
    				each_value_2 = /*labels_top*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div1, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			}

    			if (dirty & /*data, size*/ 3) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div2, "grid-template-columns", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(div2, "grid-template-rows", "repeat(" + /*data*/ ctx[0].length + ", 1fr)");
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div3, "grid-template-rows", /*size*/ ctx[1] * 0.2 + "px 1fr");
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div4, "grid-template-columns", /*size*/ ctx[1] * 0.2 + "px 1fr");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(18:2) {#if showLabels}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {#each line as e}
    function create_each_block_5(ctx) {
    	let div;
    	let p;
    	let t0_value = /*e*/ ctx[9] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-25xnht");
    			add_location(p, file$l, 85, 12, 2660);
    			attr_dev(div, "class", "element unselectable svelte-25xnht");
    			set_style(div, "height", /*size*/ ctx[1] / /*data*/ ctx[0].length + "px");
    			set_style(div, "line-height", /*size*/ ctx[1] / /*data*/ ctx[0].length + "px");
    			add_location(div, file$l, 80, 10, 2483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*e*/ ctx[9] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "height", /*size*/ ctx[1] / /*data*/ ctx[0].length + "px");
    			}

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "line-height", /*size*/ ctx[1] / /*data*/ ctx[0].length + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(80:8) {#each line as e}",
    		ctx
    	});

    	return block;
    }

    // (79:6) {#each data as line}
    function create_each_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*line*/ ctx[6];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, data*/ 3) {
    				each_value_5 = /*line*/ ctx[6];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(79:6) {#each data as line}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#each labels_side as l}
    function create_each_block_3(ctx) {
    	let div;
    	let p;
    	let t0_value = /*l*/ ctx[12] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-25xnht");
    			add_location(p, file$l, 33, 12, 1066);
    			attr_dev(div, "class", "label unselectable svelte-25xnht");
    			set_style(div, "height", /*size*/ ctx[1] / (/*data*/ ctx[0].length + 1) + "px");
    			set_style(div, "line-height", /*size*/ ctx[1] / (/*data*/ ctx[0].length + 1) + "px");
    			add_location(div, file$l, 28, 10, 878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels_side*/ 32 && t0_value !== (t0_value = /*l*/ ctx[12] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "height", /*size*/ ctx[1] / (/*data*/ ctx[0].length + 1) + "px");
    			}

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "line-height", /*size*/ ctx[1] / (/*data*/ ctx[0].length + 1) + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(28:8) {#each labels_side as l}",
    		ctx
    	});

    	return block;
    }

    // (47:10) {#each labels_top as l}
    function create_each_block_2$1(ctx) {
    	let div;
    	let p;
    	let t0_value = /*l*/ ctx[12] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-25xnht");
    			add_location(p, file$l, 51, 14, 1612);
    			attr_dev(div, "class", "label unselectable svelte-25xnht");
    			set_style(div, "height", /*size*/ ctx[1] * 0.2 + "px");
    			set_style(div, "line-height", /*size*/ ctx[1] * 0.2 + "px");
    			add_location(div, file$l, 47, 12, 1459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels_top*/ 16 && t0_value !== (t0_value = /*l*/ ctx[12] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1] * 0.2 + "px");
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "line-height", /*size*/ ctx[1] * 0.2 + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(47:10) {#each labels_top as l}",
    		ctx
    	});

    	return block;
    }

    // (61:12) {#each line as e}
    function create_each_block_1$1(ctx) {
    	let div;
    	let p;
    	let t0_value = /*e*/ ctx[9] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-25xnht");
    			add_location(p, file$l, 66, 16, 2138);
    			attr_dev(div, "class", "element unselectable svelte-25xnht");
    			set_style(div, "height", /*size*/ ctx[1] * 0.8 / /*data*/ ctx[0].length + "px");
    			set_style(div, "line-height", /*size*/ ctx[1] * 0.8 / /*data*/ ctx[0].length + "px");
    			add_location(div, file$l, 61, 14, 1925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*e*/ ctx[9] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "height", /*size*/ ctx[1] * 0.8 / /*data*/ ctx[0].length + "px");
    			}

    			if (dirty & /*size, data*/ 3) {
    				set_style(div, "line-height", /*size*/ ctx[1] * 0.8 / /*data*/ ctx[0].length + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(61:12) {#each line as e}",
    		ctx
    	});

    	return block;
    }

    // (60:10) {#each data as line}
    function create_each_block$4(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*line*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, data*/ 3) {
    				each_value_1 = /*line*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(60:10) {#each data as line}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*showLabels*/ ctx[3]) return create_if_block$7;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "container svelte-25xnht");
    			set_style(div, "display", /*display*/ ctx[2]);
    			set_style(div, "width", /*size*/ ctx[1] + "px");
    			set_style(div, "height", /*size*/ ctx[1] + "px");
    			set_style(div, "margin-bottom", "30px");
    			add_location(div, file$l, 13, 0, 425);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*display*/ 4) {
    				set_style(div, "display", /*display*/ ctx[2]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "width", /*size*/ ctx[1] + "px");
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Matrix', slots, []);
    	let { data } = $$props;
    	let { size } = $$props;
    	let { display = "block" } = $$props;
    	let { showLabels = "false" } = $$props;
    	let labels_top = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    	labels_top = labels_top.filter(l => l <= data.length);
    	let labels_side = ["A", "B", "C", "D", "E", "F", "G", "H"];
    	labels_side = labels_side.slice(0, data.length);
    	labels_side = ["", ...labels_side];
    	const writable_props = ['data', 'size', 'display', 'showLabels'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Matrix> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('display' in $$props) $$invalidate(2, display = $$props.display);
    		if ('showLabels' in $$props) $$invalidate(3, showLabels = $$props.showLabels);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		size,
    		display,
    		showLabels,
    		labels_top,
    		labels_side
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('display' in $$props) $$invalidate(2, display = $$props.display);
    		if ('showLabels' in $$props) $$invalidate(3, showLabels = $$props.showLabels);
    		if ('labels_top' in $$props) $$invalidate(4, labels_top = $$props.labels_top);
    		if ('labels_side' in $$props) $$invalidate(5, labels_side = $$props.labels_side);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, size, display, showLabels, labels_top, labels_side];
    }

    class Matrix extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			data: 0,
    			size: 1,
    			display: 2,
    			showLabels: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Matrix",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<Matrix> was created without expected prop 'data'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Matrix> was created without expected prop 'size'");
    		}
    	}

    	get data() {
    		throw new Error("<Matrix>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Matrix>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Matrix>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Matrix>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display() {
    		throw new Error("<Matrix>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display(value) {
    		throw new Error("<Matrix>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLabels() {
    		throw new Error("<Matrix>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLabels(value) {
    		throw new Error("<Matrix>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\lessons\QUBOIntroduction.svelte generated by Svelte v3.46.4 */
    const file$k = "src\\components\\lessons\\QUBOIntroduction.svelte";

    function create_fragment$k(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div2;
    	let p0;
    	let t3;
    	let strong0;
    	let t5;
    	let strong1;
    	let t7;
    	let t8;
    	let ul;
    	let li0;
    	let i0;
    	let t10;
    	let t11;
    	let li1;
    	let i1;
    	let t13;
    	let t14;
    	let li2;
    	let i2;
    	let t16;
    	let t17;
    	let li3;
    	let i3;
    	let t19;
    	let t20;
    	let p1;
    	let t22;
    	let i4;
    	let t24;
    	let div1;
    	let img;
    	let img_src_value;
    	let t25;
    	let matrix;
    	let t26;
    	let p2;
    	let t27;
    	let span0;
    	let t29;
    	let span1;
    	let t31;
    	let span2;
    	let t33;
    	let span3;
    	let t35;
    	let strong2;
    	let t37;
    	let strong3;
    	let t39;
    	let t40;
    	let p3;
    	let t41;
    	let strong4;
    	let t43;
    	let span4;
    	let t45;
    	let span5;
    	let t47;
    	let span6;
    	let t49;
    	let span7;
    	let t51;
    	let t52_value = `$$f\\left(a,b,c,d\\right)=h_aa+h_bb+h_cc+h_dd+h_{ab}ab+h_{ac}ac+h_{ad}ad+h_{bc}bc+h_{bd}bd+h_{cd}cd$$` + "";
    	let t52;
    	let t53;
    	let i5;
    	let t55;
    	let span8;
    	let t57;
    	let span9;
    	let t59;
    	let span10;
    	let t61;
    	let span11;
    	let t63;
    	let span12;
    	let t65;
    	let span13;
    	let t67;
    	let span14;
    	let t69;
    	let span15;
    	let t71;
    	let span16;
    	let t73;
    	let t74;
    	let p4;
    	let t75;
    	let t76_value = `$$f\\left(a,b,c,d\\right)=(-1)\\times a+(-1)\\times b+(-1)\\times c+(-1)\\times d=-a-b-c-d$$` + "";
    	let t76;
    	let t77;
    	let span17;
    	let t79;
    	let span18;
    	let t81;
    	let strong5;
    	let t83;
    	let t84_value = `$$f\\left(a,b,c,d\\right)=-a-b-c-d+4ab$$` + "";
    	let t84;
    	let t85;
    	let span19;
    	let t87;
    	let span20;
    	let t89;
    	let i6;
    	let t91;
    	let ins0;
    	let t93;
    	let t94_value = `$$f\\left(a,b,c,d\\right)=\\left(a+b+c+d-2\\right)^2$$` + "";
    	let t94;
    	let t95;
    	let t96_value = `$$=a^2+2ab+2ac+2ad-4a+b^2+2bc+2bd-4b+c^2+2cd-4c+d^2-4d+4$$` + "";
    	let t96;
    	let t97;
    	let t98_value = `$$=-3a-3b-3c-3d+2ab+2ac+2ad+2bc+2bd+2cd$$` + "";
    	let t98;
    	let t99;
    	let span21;
    	let t100;
    	let sup0;
    	let t102;
    	let span22;
    	let t103;
    	let sup1;
    	let t105;
    	let span23;
    	let t106;
    	let sup2;
    	let t108;
    	let t109;
    	let span24;
    	let t111;
    	let span25;
    	let t113;
    	let t114_value = `$$f\\left(0, 1, 0, 0\\right)=-3$$` + "";
    	let t114;
    	let t115;
    	let t116_value = `$$f\\left(1, 0, 1, 0\\right)=-4$$` + "";
    	let t116;
    	let t117;
    	let t118_value = `$$f\\left(0, 1, 1, 1\\right)=-3$$` + "";
    	let t118;
    	let t119;
    	let t120_value = `$$f\\left(1, 1, 1, 1\\right)=0$$` + "";
    	let t120;
    	let t121;
    	let p5;
    	let t123;
    	let ol;
    	let li4;
    	let t126;
    	let li5;
    	let t127;
    	let ins1;
    	let t129;
    	let t130_value = `$$f\\left(a,b,c,d\\right)=\\left(a+b+c+d-\\frac{1}{2}\\right)^2=2ab+2ac+2ad+2bc+2bd+2cd$$` + "";
    	let t130;
    	let t131;
    	let li6;
    	let t132;
    	let ins2;
    	let t134;
    	let t135_value = `$$f\\left(a,b,c,d\\right)=\\left(a+b-1\\right)^2+\\left(c+d-1\\right)^2+\\left(a+c-1\\right)^2+\\left(c+d-1\\right)^2=-2a-2b-2c-2d+2ab+2ac+2bd+2cd$$` + "";
    	let t135;
    	let current;

    	matrix = new Matrix({
    			props: {
    				size: "150",
    				data: /*matrix1*/ ctx[0],
    				showLabels: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "QUBO-problems";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text("Before we can explore how quantum annealers work, there is an essential basic to be covered. For a quantum annealer to solve a task, it must be defined as a ");
    			strong0 = element("strong");
    			strong0.textContent = "quadratic unconstrained binary optimization problem";
    			t5 = text(" or ");
    			strong1 = element("strong");
    			strong1.textContent = "QUBO problem";
    			t7 = text(" for short. This isn't particularly helpful, so let's break it down:");
    			t8 = space();
    			ul = element("ul");
    			li0 = element("li");
    			i0 = element("i");
    			i0.textContent = "Quadratic";
    			t10 = text(" means a maximum of two variables can be multiplied.");
    			t11 = space();
    			li1 = element("li");
    			i1 = element("i");
    			i1.textContent = "Unconstrained";
    			t13 = text(" means the correct answer is not constrained by other conditions.");
    			t14 = space();
    			li2 = element("li");
    			i2 = element("i");
    			i2.textContent = "Binary";
    			t16 = text(" means we can insert 0 or 1 only.");
    			t17 = space();
    			li3 = element("li");
    			i3 = element("i");
    			i3.textContent = "Optimization";
    			t19 = text(" is – if you remember from the previous lessons – the process of finding the optimal solution to a complex problem with approximation.");
    			t20 = space();
    			p1 = element("p");
    			p1.textContent = "The QUBO form is another mathematical construct that aids the quantum annealer in utilizing the physical properties of its qubits. Let's look at an example to illustrate the concept.";
    			t22 = space();
    			i4 = element("i");
    			i4.textContent = "Sidenote: The following is only one possible type of QUBO problem, but since it is closest to the TSP, it is the only one covered in this course. Also, there are other ways of programming a quantum annealer, like Ising problems, which we will omit for the sake of conciseness.";
    			t24 = space();
    			div1 = element("div");
    			img = element("img");
    			t25 = space();
    			create_component(matrix.$$.fragment);
    			t26 = space();
    			p2 = element("p");
    			t27 = text("This 2x2 checkers board has the four fields ");
    			span0 = element("span");
    			span0.textContent = "a";
    			t29 = text(", ");
    			span1 = element("span");
    			span1.textContent = "b";
    			t31 = text(", ");
    			span2 = element("span");
    			span2.textContent = "c";
    			t33 = text(", and ");
    			span3 = element("span");
    			span3.textContent = "d";
    			t35 = text(". Additionally, there are four pieces, each of which can, but doesn't have to be placed on any field (but not multiple on the same field). When a field is occupied, it is represented as ");
    			strong2 = element("strong");
    			strong2.textContent = "1";
    			t37 = text(", otherwise as a ");
    			strong3 = element("strong");
    			strong3.textContent = "0";
    			t39 = text(". The quantum computer should place the pieces so that as many fields as possible are occupied.");
    			t40 = space();
    			p3 = element("p");
    			t41 = text("Again: A computer needs numbers. Is there a way to tell how good a particular solution is? All optimization problems require a ");
    			strong4 = element("strong");
    			strong4.textContent = "cost function";
    			t43 = text(", which rates a solution's correctness: The lower the cost, the better. Now, our goal shifted from finding the best solution to minimizing the cost function. If we have a QUBO problem that takes four variables ");
    			span4 = element("span");
    			span4.textContent = "a";
    			t45 = text(", ");
    			span5 = element("span");
    			span5.textContent = "b";
    			t47 = text(", ");
    			span6 = element("span");
    			span6.textContent = "c";
    			t49 = text(", and ");
    			span7 = element("span");
    			span7.textContent = "d";
    			t51 = text(" (which are either 0 or 1) as an input, the cost function is defined as follows:\r\n    ");
    			t52 = text(t52_value);
    			t53 = text("\r\n    First, we sum up the values of all fields, then we add the product of each possible ");
    			i5 = element("i");
    			i5.textContent = "pair";
    			t55 = text(" of the field values. The ");
    			span8 = element("span");
    			span8.textContent = "h";
    			t57 = text(" with which the field values are multiplied are simple coefficients, i.e. real numbers, that control how much we want to reward (or punish) the individual occupancies. This is quite a clever system: If a field is unoccupied, meaning 0, it eliminates the corresponding coefficient from the equation. Similarly, in the pairs of fields, a reward only stays in the equation if both fields are 1. Since we are searching for the lowest cost, ");
    			span9 = element("span");
    			span9.textContent = "h < 0";
    			t59 = text(" means \"reward\", ");
    			span10 = element("span");
    			span10.textContent = "h > 0";
    			t61 = text(" \"punishment\" and ");
    			span11 = element("span");
    			span11.textContent = "h = 0";
    			t63 = text(" \"irrelevant\". For example: If we really want ");
    			span12 = element("span");
    			span12.textContent = "a";
    			t65 = text(" to be occupied, we can give it an ");
    			span13 = element("span");
    			span13.textContent = "h";
    			t67 = text(" of -10, or if we want to prevent that ");
    			span14 = element("span");
    			span14.textContent = "b";
    			t69 = text(" and ");
    			span15 = element("span");
    			span15.textContent = "c";
    			t71 = text(" are occupied simultaneously, ");
    			span16 = element("span");
    			span16.textContent = "h";
    			t73 = text(" should be a high positive number like 25.");
    			t74 = space();
    			p4 = element("p");
    			t75 = text("Now we can define a QUBO problem for our original task: As many fields as possible should be occupied.\r\n    ");
    			t76 = text(t76_value);
    			t77 = text("\r\n    We can omit to calculate the pairs of field values since the relations between fields are irrelevant for this problem. This is a valid cost function because the lowest cost, -4, is only reached if all fields are 1. Let's add the following condition to our task: Fields ");
    			span17 = element("span");
    			span17.textContent = "a";
    			t79 = text(" and ");
    			span18 = element("span");
    			span18.textContent = "b";
    			t81 = text(" can ");
    			strong5 = element("strong");
    			strong5.textContent = "not";
    			t83 = text(" be occupied at the same time.\r\n    ");
    			t84 = text(t84_value);
    			t85 = text("\r\n    If ");
    			span19 = element("span");
    			span19.textContent = "a";
    			t87 = text(" and ");
    			span20 = element("span");
    			span20.textContent = "b";
    			t89 = text(" are both 1, even if all fields are occupied for maximum reward, the cost is 0, meaning it's worse than all the other possible solutions. Hence, the best cost achievable here is -3, displaying the correct solution. Another practical strategy in QUBO problems is ");
    			i6 = element("i");
    			i6.textContent = "squaring";
    			t91 = text(", for instance for the task \"Exactly ");
    			ins0 = element("ins");
    			ins0.textContent = "two out of four";
    			t93 = text(" fields should be occupied\":\r\n    ");
    			t94 = text(t94_value);
    			t95 = space();
    			t96 = text(t96_value);
    			t97 = space();
    			t98 = text(t98_value);
    			t99 = text("\r\n    This works because when summing up all fields and subtracting 2, the result is only 0 if exactly two fields are 1. But: If no field or one field is occupied, the result would be negative, giving an even better result. This can be fixed by squaring the equation because squaring a negative number will result in a positive value. The squared field values like ");
    			span21 = element("span");
    			t100 = text("a");
    			sup0 = element("sup");
    			sup0.textContent = "2";
    			t102 = text(", ");
    			span22 = element("span");
    			t103 = text("b");
    			sup1 = element("sup");
    			sup1.textContent = "2";
    			t105 = text(", etc. that result from multiplying the equation out would be illegal (i.e. against the rules of QUBO), but since in the case of binary numbers ");
    			span23 = element("span");
    			t106 = text("x");
    			sup2 = element("sup");
    			sup2.textContent = "2";
    			t108 = text("=x");
    			t109 = text(", they can be replaced with ");
    			span24 = element("span");
    			span24.textContent = "a";
    			t111 = text(", ");
    			span25 = element("span");
    			span25.textContent = "b";
    			t113 = text(", etc. Also, constants like +4 can be omitted as well, because they just shift all results up or down by the same amount. We can check if our cost function works by testing it with different inputs:\r\n    ");
    			t114 = text(t114_value);
    			t115 = space();
    			t116 = text(t116_value);
    			t117 = space();
    			t118 = text(t118_value);
    			t119 = space();
    			t120 = text(t120_value);
    			t121 = space();
    			p5 = element("p");
    			p5.textContent = "Here are some other examples of QUBO equations:";
    			t123 = space();
    			ol = element("ol");
    			li4 = element("li");
    			li4.textContent = `As many fields as possible should be empty. ${`$$f\\left(a,b,c,d\\right)=a+b+c+d$$`}`;
    			t126 = space();
    			li5 = element("li");
    			t127 = text("There should be ");
    			ins1 = element("ins");
    			ins1.textContent = "no more than one";
    			t129 = text(" field occupied. (i.e.: Exactly zero fields or one field should be occupied.) ");
    			t130 = text(t130_value);
    			t131 = space();
    			li6 = element("li");
    			t132 = text("In every row and every column, ");
    			ins2 = element("ins");
    			ins2.textContent = "exactly one";
    			t134 = text(" field should be occupied. ");
    			t135 = text(t135_value);
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$k, 10, 2, 161);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$k, 9, 0, 138);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$k, 12, 0, 193);
    			add_location(strong0, file$k, 15, 161, 387);
    			add_location(strong1, file$k, 15, 233, 459);
    			add_location(p0, file$k, 14, 2, 221);
    			add_location(i0, file$k, 18, 8, 582);
    			add_location(li0, file$k, 18, 4, 578);
    			add_location(i1, file$k, 19, 8, 665);
    			add_location(li1, file$k, 19, 4, 661);
    			add_location(i2, file$k, 20, 8, 765);
    			add_location(li2, file$k, 20, 4, 761);
    			add_location(i3, file$k, 21, 8, 826);
    			add_location(li3, file$k, 21, 4, 822);
    			add_location(ul, file$k, 17, 2, 568);
    			add_location(p1, file$k, 23, 2, 997);
    			set_style(i4, "color", "#aaa");
    			add_location(i4, file$k, 26, 2, 1200);
    			attr_dev(img, "width", "150");
    			if (!src_url_equal(img.src, img_src_value = "/img/Checkers.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "A checkers board with fields labeled a, b, c and d, above it four pieces");
    			add_location(img, file$k, 29, 22, 1537);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$k, 29, 2, 1517);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$k, 32, 48, 1779);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$k, 32, 81, 1812);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$k, 32, 114, 1845);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$k, 32, 151, 1882);
    			add_location(strong2, file$k, 32, 368, 2099);
    			add_location(strong3, file$k, 32, 403, 2134);
    			add_location(p2, file$k, 31, 2, 1726);
    			add_location(strong4, file$k, 35, 131, 2395);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$k, 35, 371, 2635);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$k, 35, 404, 2668);
    			attr_dev(span6, "class", "emphasis");
    			add_location(span6, file$k, 35, 437, 2701);
    			attr_dev(span7, "class", "emphasis");
    			add_location(span7, file$k, 35, 474, 2738);
    			add_location(i5, file$k, 37, 88, 3050);
    			attr_dev(span8, "class", "emphasis");
    			add_location(span8, file$k, 37, 125, 3087);
    			attr_dev(span9, "class", "emphasis");
    			add_location(span9, file$k, 37, 592, 3554);
    			attr_dev(span10, "class", "emphasis");
    			add_location(span10, file$k, 37, 648, 3610);
    			attr_dev(span11, "class", "emphasis");
    			add_location(span11, file$k, 37, 705, 3667);
    			attr_dev(span12, "class", "emphasis");
    			add_location(span12, file$k, 37, 786, 3748);
    			attr_dev(span13, "class", "emphasis");
    			add_location(span13, file$k, 37, 852, 3814);
    			attr_dev(span14, "class", "emphasis");
    			add_location(span14, file$k, 37, 922, 3884);
    			attr_dev(span15, "class", "emphasis");
    			add_location(span15, file$k, 37, 958, 3920);
    			attr_dev(span16, "class", "emphasis");
    			add_location(span16, file$k, 37, 1019, 3981);
    			add_location(p3, file$k, 34, 2, 2259);
    			attr_dev(span17, "class", "emphasis");
    			add_location(span17, file$k, 42, 273, 4554);
    			attr_dev(span18, "class", "emphasis");
    			add_location(span18, file$k, 42, 309, 4590);
    			add_location(strong5, file$k, 42, 345, 4626);
    			attr_dev(span19, "class", "emphasis");
    			add_location(span19, file$k, 44, 7, 4735);
    			attr_dev(span20, "class", "emphasis");
    			add_location(span20, file$k, 44, 43, 4771);
    			add_location(i6, file$k, 44, 336, 5064);
    			add_location(ins0, file$k, 44, 388, 5116);
    			add_location(sup0, file$k, 48, 387, 5742);
    			attr_dev(span21, "class", "emphasis");
    			add_location(span21, file$k, 48, 363, 5718);
    			add_location(sup1, file$k, 48, 432, 5787);
    			attr_dev(span22, "class", "emphasis");
    			add_location(span22, file$k, 48, 408, 5763);
    			add_location(sup2, file$k, 48, 619, 5974);
    			attr_dev(span23, "class", "emphasis");
    			add_location(span23, file$k, 48, 595, 5950);
    			attr_dev(span24, "class", "emphasis");
    			add_location(span24, file$k, 48, 668, 6023);
    			attr_dev(span25, "class", "emphasis");
    			add_location(span25, file$k, 48, 701, 6056);
    			add_location(p4, file$k, 39, 2, 4066);
    			add_location(p5, file$k, 54, 2, 6468);
    			add_location(li4, file$k, 58, 4, 6546);
    			add_location(ins1, file$k, 59, 24, 6664);
    			add_location(li5, file$k, 59, 4, 6644);
    			add_location(ins2, file$k, 60, 39, 6908);
    			add_location(li6, file$k, 60, 4, 6873);
    			add_location(ol, file$k, 57, 2, 6536);
    			attr_dev(div2, "class", "text");
    			add_location(div2, file$k, 13, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(p0, strong0);
    			append_dev(p0, t5);
    			append_dev(p0, strong1);
    			append_dev(p0, t7);
    			append_dev(div2, t8);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, i0);
    			append_dev(li0, t10);
    			append_dev(ul, t11);
    			append_dev(ul, li1);
    			append_dev(li1, i1);
    			append_dev(li1, t13);
    			append_dev(ul, t14);
    			append_dev(ul, li2);
    			append_dev(li2, i2);
    			append_dev(li2, t16);
    			append_dev(ul, t17);
    			append_dev(ul, li3);
    			append_dev(li3, i3);
    			append_dev(li3, t19);
    			append_dev(div2, t20);
    			append_dev(div2, p1);
    			append_dev(div2, t22);
    			append_dev(div2, i4);
    			append_dev(div2, t24);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div2, t25);
    			mount_component(matrix, div2, null);
    			append_dev(div2, t26);
    			append_dev(div2, p2);
    			append_dev(p2, t27);
    			append_dev(p2, span0);
    			append_dev(p2, t29);
    			append_dev(p2, span1);
    			append_dev(p2, t31);
    			append_dev(p2, span2);
    			append_dev(p2, t33);
    			append_dev(p2, span3);
    			append_dev(p2, t35);
    			append_dev(p2, strong2);
    			append_dev(p2, t37);
    			append_dev(p2, strong3);
    			append_dev(p2, t39);
    			append_dev(div2, t40);
    			append_dev(div2, p3);
    			append_dev(p3, t41);
    			append_dev(p3, strong4);
    			append_dev(p3, t43);
    			append_dev(p3, span4);
    			append_dev(p3, t45);
    			append_dev(p3, span5);
    			append_dev(p3, t47);
    			append_dev(p3, span6);
    			append_dev(p3, t49);
    			append_dev(p3, span7);
    			append_dev(p3, t51);
    			append_dev(p3, t52);
    			append_dev(p3, t53);
    			append_dev(p3, i5);
    			append_dev(p3, t55);
    			append_dev(p3, span8);
    			append_dev(p3, t57);
    			append_dev(p3, span9);
    			append_dev(p3, t59);
    			append_dev(p3, span10);
    			append_dev(p3, t61);
    			append_dev(p3, span11);
    			append_dev(p3, t63);
    			append_dev(p3, span12);
    			append_dev(p3, t65);
    			append_dev(p3, span13);
    			append_dev(p3, t67);
    			append_dev(p3, span14);
    			append_dev(p3, t69);
    			append_dev(p3, span15);
    			append_dev(p3, t71);
    			append_dev(p3, span16);
    			append_dev(p3, t73);
    			append_dev(div2, t74);
    			append_dev(div2, p4);
    			append_dev(p4, t75);
    			append_dev(p4, t76);
    			append_dev(p4, t77);
    			append_dev(p4, span17);
    			append_dev(p4, t79);
    			append_dev(p4, span18);
    			append_dev(p4, t81);
    			append_dev(p4, strong5);
    			append_dev(p4, t83);
    			append_dev(p4, t84);
    			append_dev(p4, t85);
    			append_dev(p4, span19);
    			append_dev(p4, t87);
    			append_dev(p4, span20);
    			append_dev(p4, t89);
    			append_dev(p4, i6);
    			append_dev(p4, t91);
    			append_dev(p4, ins0);
    			append_dev(p4, t93);
    			append_dev(p4, t94);
    			append_dev(p4, t95);
    			append_dev(p4, t96);
    			append_dev(p4, t97);
    			append_dev(p4, t98);
    			append_dev(p4, t99);
    			append_dev(p4, span21);
    			append_dev(span21, t100);
    			append_dev(span21, sup0);
    			append_dev(p4, t102);
    			append_dev(p4, span22);
    			append_dev(span22, t103);
    			append_dev(span22, sup1);
    			append_dev(p4, t105);
    			append_dev(p4, span23);
    			append_dev(span23, t106);
    			append_dev(span23, sup2);
    			append_dev(span23, t108);
    			append_dev(p4, t109);
    			append_dev(p4, span24);
    			append_dev(p4, t111);
    			append_dev(p4, span25);
    			append_dev(p4, t113);
    			append_dev(p4, t114);
    			append_dev(p4, t115);
    			append_dev(p4, t116);
    			append_dev(p4, t117);
    			append_dev(p4, t118);
    			append_dev(p4, t119);
    			append_dev(p4, t120);
    			append_dev(div2, t121);
    			append_dev(div2, p5);
    			append_dev(div2, t123);
    			append_dev(div2, ol);
    			append_dev(ol, li4);
    			append_dev(ol, t126);
    			append_dev(ol, li5);
    			append_dev(li5, t127);
    			append_dev(li5, ins1);
    			append_dev(li5, t129);
    			append_dev(li5, t130);
    			append_dev(ol, t131);
    			append_dev(ol, li6);
    			append_dev(li6, t132);
    			append_dev(li6, ins2);
    			append_dev(li6, t134);
    			append_dev(li6, t135);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(matrix.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(matrix.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(matrix);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QUBOIntroduction', slots, []);
    	const matrix1 = [["a", "b"], ["c", "d"]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QUBOIntroduction> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Matrix, matrix1 });
    	return [matrix1];
    }

    class QUBOIntroduction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QUBOIntroduction",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\lessons\QuantumAnnealers.svelte generated by Svelte v3.46.4 */
    const file$j = "src\\components\\lessons\\QuantumAnnealers.svelte";

    // (77:8) <Link target="https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)" newPage={true}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(77:8) <Link target=\\\"https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (79:78) <Link target="https://support.dwavesys.com/hc/en-us/articles/4410049473047-New-QPU-Solver-Advantage-Performance-Update" newPage={true}>
    function create_default_slot$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://support.dwavesys.com/hc/en-us/articles/4410049473047-New-QPU-Solver-Advantage-Performance-Update");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(79:78) <Link target=\\\"https://support.dwavesys.com/hc/en-us/articles/4410049473047-New-QPU-Solver-Advantage-Performance-Update\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr0;
    	let t2;
    	let div5;
    	let p0;
    	let t4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t5;
    	let p1;
    	let t7;
    	let h30;
    	let t9;
    	let p2;
    	let t10;
    	let sup0;
    	let t12;
    	let t13_value = `$$\\vec{ q }=\\begin{pmatrix}q_1 \\\\ q_2 \\\\ q_3\\end{pmatrix}$$` + "";
    	let t13;
    	let t14;
    	let sup1;
    	let t16;
    	let span0;
    	let t18;
    	let span1;
    	let t20;
    	let span2;
    	let t22;
    	let strong0;
    	let t23;
    	let sub0;
    	let t25;
    	let t26_value = `$$\\vec{q}_A = \\begin{pmatrix}a \\\\ b \\\\ \\vdots \\\\ n\\end{pmatrix} = \\begin{pmatrix}0 \\\\ 1 \\\\ \\vdots \\\\ 1\\end{pmatrix}$$` + "";
    	let t26;
    	let t27;
    	let i0;
    	let t29;
    	let span3;
    	let t30;
    	let sub1;
    	let t32;
    	let span4;
    	let t34;
    	let span5;
    	let t36;
    	let t37;
    	let matrix0;
    	let t38;
    	let p3;
    	let t39;
    	let sub2;
    	let t41;
    	let t42;
    	let p4;
    	let t43;
    	let t44_value = `$$f\\left(a,b,c,d\\right)=h_aa+h_bb+h_cc+h_dd+h_{ab}ab+h_{ac}ac+h_{ad}ad+h_{bc}bc+h_{bd}bd+h_{cd}cd$$` + "";
    	let t44;
    	let t45;
    	let t46_value = `$$\\Rightarrow H=\\begin{pmatrix}h_a & h_{ab} & h_{ac} & h_{ad} \\\\ 0 & h_b & h_{bc} & h_{bd} \\\\ 0 & 0 & h_c & h_{cd} \\\\ 0 & 0 & 0 & h_d\\end{pmatrix}$$` + "";
    	let t46;
    	let t47;
    	let strong1;
    	let t49;
    	let strong2;
    	let t51;
    	let span6;
    	let t53;
    	let span7;
    	let t55;
    	let i1;
    	let t57;
    	let t58_value = `$$f\\left(a,b,c,d\\right)=-3a-3b-3c-3d+2ab+2ac+2ad+2bc+2bd+2cd\\Rightarrow$$` + "";
    	let t58;
    	let t59;
    	let matrix1_1;
    	let t60;
    	let p5;
    	let t61;
    	let sup2;
    	let t63;
    	let t64_value = `$$\\min C\\left(q\\right)=\\min_{q_i=0,1}\\left(\\sum_{i=1}^{N}a_iq_i+\\sum_{i<j}^{N}b_{ij}q_iq_j\\right)=\\min\\left(\\vec{q}^TH\\vec{q}\\right)$$` + "";
    	let t64;
    	let t65;
    	let span8;
    	let t67;
    	let span9;
    	let t68;
    	let sub3;
    	let t70;
    	let span10;
    	let t71;
    	let sub4;
    	let t73;
    	let span11;
    	let t74;
    	let sub5;
    	let t76;
    	let span12;
    	let t77;
    	let sub6;
    	let t79;
    	let span13;
    	let t80;
    	let sub7;
    	let t82;
    	let t83;
    	let div2;
    	let strong3;
    	let t85;
    	let h31;
    	let t87;
    	let p6;
    	let t89;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t90;
    	let p7;
    	let t91;
    	let i2;
    	let t93;
    	let sup3;
    	let t95;
    	let i3;
    	let t97;
    	let i4;
    	let t99;
    	let i5;
    	let t101;
    	let i6;
    	let t103;
    	let t104;
    	let p8;
    	let t105;
    	let i7;
    	let t107;
    	let i8;
    	let t109;
    	let t110;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let br;
    	let i9;
    	let t111;
    	let sup4;
    	let t113;
    	let p9;
    	let t114;
    	let span14;
    	let t116;
    	let span15;
    	let t118;
    	let span16;
    	let t119;
    	let sub8;
    	let t121;
    	let span17;
    	let t122;
    	let sub9;
    	let t124;
    	let i10;
    	let t126;
    	let i11;
    	let t128;
    	let t129;
    	let hr1;
    	let t130;
    	let div6;
    	let h32;
    	let t132;
    	let ol;
    	let li0;
    	let link0;
    	let t133;
    	let t134;
    	let li1;
    	let t135;
    	let i12;
    	let t137;
    	let t138;
    	let li2;
    	let t139;
    	let i13;
    	let t141;
    	let link1;
    	let t142;
    	let t143;
    	let li3;
    	let t144;
    	let i14;
    	let t146;
    	let current;

    	matrix0 = new Matrix({
    			props: {
    				size: "200",
    				data: /*matrix1*/ ctx[0],
    				showLabels: false
    			},
    			$$inline: true
    		});

    	matrix1_1 = new Matrix({
    			props: {
    				size: "150",
    				data: /*matrix2*/ ctx[1],
    				showLabels: false
    			},
    			$$inline: true
    		});

    	link0 = new Link({
    			props: {
    				target: "https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)",
    				newPage: true,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				target: "https://support.dwavesys.com/hc/en-us/articles/4410049473047-New-QPU-Solver-Advantage-Performance-Update",
    				newPage: true,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "How do quantum annealers work?";
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			div5 = element("div");
    			p0 = element("p");
    			p0.textContent = "Equipped with the basic mathematics, we can now face the question: How do we get from an input to a result? The process of programming a quantum annealer differs greatly from that of a traditional computer since it takes numbers rather than instructions or lines of code. Here is a depiction of this procedure:";
    			t4 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "This may look a bit confusing, so let's tackle it step-by-step.";
    			t7 = space();
    			h30 = element("h3");
    			h30.textContent = "Vectors and matrices";
    			t9 = space();
    			p2 = element("p");
    			t10 = text("To represent our data, we need yet another mathematical construct. In its traditional form, a vector is a quantity in space with a direction and length (often represented as an arrow or ray)");
    			sup0 = element("sup");
    			sup0.textContent = "1";
    			t12 = text(" and consists of two or more coordinates written in a vertical column. For example, a vector in 3-dimensional space would contain three coordinates:\r\n    ");
    			t13 = text(t13_value);
    			t14 = text("\r\n    As a vector holds an array of numbers, we can utilize vectors to retrieve our results from the quantum annealer. If we had a 4x4 board with 4");
    			sup1 = element("sup");
    			sup1.textContent = "2";
    			t16 = text("=16 fields, the entries would denote whether our fields ");
    			span0 = element("span");
    			span0.textContent = "a";
    			t18 = text(", ");
    			span1 = element("span");
    			span1.textContent = "b";
    			t20 = text(", etc. through ");
    			span2 = element("span");
    			span2.textContent = "n";
    			t22 = text(" should be occupied (1) or not (0). This is defined as the ");
    			strong0 = element("strong");
    			t23 = text("answer vector q");
    			sub0 = element("sub");
    			sub0.textContent = "A";
    			t25 = text(".\r\n    ");
    			t26 = text(t26_value);
    			t27 = text("\r\n    Similarly, think of a ");
    			i0 = element("i");
    			i0.textContent = "matrix";
    			t29 = text(" as a series of vectors glued together. It is a rectangular field of numbers where each element is indexed in the format ");
    			span3 = element("span");
    			t30 = text("a");
    			sub1 = element("sub");
    			sub1.textContent = "ij";
    			t32 = text(" (");
    			span4 = element("span");
    			span4.textContent = "i";
    			t34 = text(" and ");
    			span5 = element("span");
    			span5.textContent = "j";
    			t36 = text(" denote the row and column index of a given element).");
    			t37 = space();
    			create_component(matrix0.$$.fragment);
    			t38 = space();
    			p3 = element("p");
    			t39 = text("For example, the element a");
    			sub2 = element("sub");
    			sub2.textContent = "31";
    			t41 = text(" of the matrix above is 5.");
    			t42 = space();
    			p4 = element("p");
    			t43 = text("Don't worry if it is not fully clear yet, we will use matrices only as a simple means to an end. Remember the QUBO equations from the previous lesson? In fact, matrices are the only way to pass those as an input to the quantum annealer. Since the form of QUBO equations is always the same, we can concatenate the coefficients (the only values that change) in a matrix of the following format to create a representation of our problem's definition:\r\n    ");
    			t44 = text(t44_value);
    			t45 = space();
    			t46 = text(t46_value);
    			t47 = text("\r\n    This is the definition of the ");
    			strong1 = element("strong");
    			strong1.textContent = "Hamilton matrix H";
    			t49 = text(", or just ");
    			strong2 = element("strong");
    			strong2.textContent = "Hamiltonian";
    			t51 = text(". In its main diagonal (the fields where ");
    			span6 = element("span");
    			span6.textContent = "i";
    			t53 = text(" and ");
    			span7 = element("span");
    			span7.textContent = "j";
    			t55 = text(" are equal) are the coefficients of the individual fields and next to them those of the connections to other fields. Because the lower half remains empty and is filled with zeros, the Hamiltonian belongs to the type of ");
    			i1 = element("i");
    			i1.textContent = "upper triangular matrices";
    			t57 = text(". If we take our \"boardgame\" example from the previous lesson with the QUBO problem \"Exactly two out of four fields should be occupied\", this is the resulting Hamiltonian:\r\n    ");
    			t58 = text(t58_value);
    			t59 = space();
    			create_component(matrix1_1.$$.fragment);
    			t60 = space();
    			p5 = element("p");
    			t61 = text("Now, we said that a quantum annealer tries to find the answer vector whose coordinates give the lowest cost. Since we compressed the cost function, which was our QUBO problem, into a matrix, the operation can be reformulated as follows");
    			sup2 = element("sup");
    			sup2.textContent = "2";
    			t63 = text(":\r\n    ");
    			t64 = text(t64_value);
    			t65 = text("\r\n    This looks more complicated than it is and just tells us that we want to minimize the cost ");
    			span8 = element("span");
    			span8.textContent = "C";
    			t67 = text(" which consists of two sums, namely the products of each coefficient ");
    			span9 = element("span");
    			t68 = text("a");
    			sub3 = element("sub");
    			sub3.textContent = "i";
    			t70 = text(" with its respective field ");
    			span10 = element("span");
    			t71 = text("q");
    			sub4 = element("sub");
    			sub4.textContent = "i";
    			t73 = text(" and the other coefficients ");
    			span11 = element("span");
    			t74 = text("b");
    			sub5 = element("sub");
    			sub5.textContent = "ij";
    			t76 = text(" with any pair of two fields ");
    			span12 = element("span");
    			t77 = text("q");
    			sub6 = element("sub");
    			sub6.textContent = "i";
    			t79 = text(" and ");
    			span13 = element("span");
    			t80 = text("q");
    			sub7 = element("sub");
    			sub7.textContent = "j";
    			t82 = text(". Alternatively, we can consider the operation as a matrix multiplication, where the Hamiltonian is multiplied from the right with the answer vector and from the left with the transformed (i.e. horizontal) answer vector.");
    			t83 = space();
    			div2 = element("div");
    			strong3 = element("strong");
    			strong3.textContent = "Congratulations! You now understand how a quantum annealer solves problems.";
    			t85 = space();
    			h31 = element("h3");
    			h31.textContent = "The inner workings";
    			t87 = space();
    			p6 = element("p");
    			p6.textContent = "But how does a quantum annealer work on the inside? This is a more complicated subject, which we can only treat superficially here without having advanced knowledge of quantum physics.";
    			t89 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t90 = space();
    			p7 = element("p");
    			t91 = text("The heart of a quantum annealer is the ");
    			i2 = element("i");
    			i2.textContent = "QPU";
    			t93 = text(" (Quantum Processing Unit");
    			sup3 = element("sup");
    			sup3.textContent = "3";
    			t95 = text("), a few square centimeters large chip, which is equipped with the quantum mechanical counterparts of the bits, ");
    			i3 = element("i");
    			i3.textContent = "qubits";
    			t97 = text(". In contrast to classical computers, these are not realized with transistors but with artificial atoms of a certain spin, which allows them to assume two states simultaneously (");
    			i4 = element("i");
    			i4.textContent = "spin up";
    			t99 = text(" and ");
    			i5 = element("i");
    			i5.textContent = "spin down";
    			t101 = text(") according to the rules of quantum physics until they are measured. The quantum annealer derives its potentially enormous computing power from this state called ");
    			i6 = element("i");
    			i6.textContent = "superposition";
    			t103 = text(".");
    			t104 = space();
    			p8 = element("p");
    			t105 = text("The current model ");
    			i7 = element("i");
    			i7.textContent = "D-Wave Advantage";
    			t107 = text(" has exactly 5627 qubits. These are interconnected with so-called ");
    			i8 = element("i");
    			i8.textContent = "couplers";
    			t109 = text(", which allow the qubits to interact with each other. The number of couplers per qubit ultimately determines the computing power of the annealer.");
    			t110 = space();
    			div4 = element("div");
    			img2 = element("img");
    			br = element("br");
    			i9 = element("i");
    			t111 = text("The graphs of the (a) Chimera architecture of the D-Wave 2000Q and the newer (b) Pegasus architecture show the differences between the QPU's structures. (a) has 6 couplers/qubit, (b) 15 couplers/qubit");
    			sup4 = element("sup");
    			sup4.textContent = "4";
    			t113 = space();
    			p9 = element("p");
    			t114 = text("These couplers consist of magnetic fields that can be tweaked individually, so that after a measurement, a qubit is more likely to become ");
    			span14 = element("span");
    			span14.textContent = "1";
    			t116 = text(" or ");
    			span15 = element("span");
    			span15.textContent = "0";
    			t118 = text(", respectively, and pairs of qubits are more likely to assume equal or unequal values. When the quantum annealer receives a Hamiltonian, it sets the coefficients ");
    			span16 = element("span");
    			t119 = text("a");
    			sub8 = element("sub");
    			sub8.textContent = "i";
    			t121 = text(" and ");
    			span17 = element("span");
    			t122 = text("b");
    			sub9 = element("sub");
    			sub9.textContent = "ij";
    			t124 = text(" as the strength of these magnetic fields also called ");
    			i10 = element("i");
    			i10.textContent = "bias";
    			t126 = text(". For the annealer to work, the QPU must be cooled to a temperature near absolute zero (16mK, approx. -273.1°C). Through an effect known as ");
    			i11 = element("i");
    			i11.textContent = "quantum tunneling";
    			t128 = text(", the qubits in this system try to anneal the state of the lowest energy, which, through the programming of the couplers, is the best solution for the original optimization problem. That is the reason why a cost function is needed: It determines the state of \"lowest cost\" (or \"lowest energy\").");
    			t129 = space();
    			hr1 = element("hr");
    			t130 = space();
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "References";
    			t132 = space();
    			ol = element("ol");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t133 = text(", accessed: 18.03.2022");
    			t134 = space();
    			li1 = element("li");
    			t135 = text("M. Willsch, D. Willsch, K. Michielsen. ");
    			i12 = element("i");
    			i12.textContent = "Lecture notes: Programming Quantum Computers";
    			t137 = text(". arXiv: 2201.02051 (2022), accessed: 19.03.2022");
    			t138 = space();
    			li2 = element("li");
    			t139 = text("Fiona H, ");
    			i13 = element("i");
    			i13.textContent = "New QPU Solver: Advantage Performance Update";
    			t141 = text(", (2021), ");
    			create_component(link1.$$.fragment);
    			t142 = text(", accessed: 20.03.2022");
    			t143 = space();
    			li3 = element("li");
    			t144 = text("Fig. 2, C. Gonzales Calaza, D. Willsch, K. Michielsen. ");
    			i14 = element("i");
    			i14.textContent = "Garden optimization problems for benchmarking quantum annealers";
    			t146 = text(". arXiv: 2101.10827 (2021), accessed: 20.03.2022");
    			attr_dev(h2, "class", "svelte-v2lwi");
    			add_location(h2, file$j, 19, 2, 355);
    			attr_dev(div0, "class", "title svelte-v2lwi");
    			add_location(div0, file$j, 18, 0, 332);
    			attr_dev(hr0, "class", "svelte-v2lwi");
    			add_location(hr0, file$j, 21, 0, 404);
    			add_location(p0, file$j, 23, 2, 434);
    			attr_dev(img0, "width", "700");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Process.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "A Hamilton matrix titled Input points to the D-Wave Advantage quantum annealer points to a vector titled Output");
    			add_location(img0, file$j, 26, 22, 785);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$j, 26, 2, 765);
    			add_location(p1, file$j, 27, 2, 953);
    			add_location(h30, file$j, 30, 2, 1037);
    			add_location(sup0, file$j, 32, 194, 1269);
    			add_location(sup1, file$j, 34, 145, 1652);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$j, 34, 213, 1720);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$j, 34, 246, 1753);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$j, 34, 292, 1799);
    			add_location(sub0, file$j, 34, 405, 1912);
    			add_location(strong0, file$j, 34, 382, 1889);
    			add_location(i0, file$j, 36, 26, 2108);
    			add_location(sub1, file$j, 36, 184, 2266);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$j, 36, 160, 2242);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$j, 36, 206, 2288);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$j, 36, 242, 2324);
    			add_location(p2, file$j, 31, 2, 1070);
    			add_location(sub2, file$j, 40, 30, 2513);
    			add_location(p3, file$j, 39, 2, 2478);
    			add_location(strong1, file$j, 46, 34, 3334);
    			add_location(strong2, file$j, 46, 78, 3378);
    			attr_dev(span6, "class", "emphasis");
    			add_location(span6, file$j, 46, 147, 3447);
    			attr_dev(span7, "class", "emphasis");
    			add_location(span7, file$j, 46, 183, 3483);
    			add_location(i1, file$j, 46, 433, 3733);
    			add_location(p4, file$j, 42, 2, 2564);
    			add_location(sup2, file$j, 51, 239, 4336);
    			attr_dev(span8, "class", "emphasis");
    			add_location(span8, file$j, 53, 95, 4603);
    			add_location(sub3, file$j, 53, 219, 4727);
    			attr_dev(span9, "class", "emphasis");
    			add_location(span9, file$j, 53, 195, 4703);
    			add_location(sub4, file$j, 53, 289, 4797);
    			attr_dev(span10, "class", "emphasis");
    			add_location(span10, file$j, 53, 265, 4773);
    			add_location(sub5, file$j, 53, 360, 4868);
    			attr_dev(span11, "class", "emphasis");
    			add_location(span11, file$j, 53, 336, 4844);
    			add_location(sub6, file$j, 53, 433, 4941);
    			attr_dev(span12, "class", "emphasis");
    			add_location(span12, file$j, 53, 409, 4917);
    			add_location(sub7, file$j, 53, 481, 4989);
    			attr_dev(span13, "class", "emphasis");
    			add_location(span13, file$j, 53, 457, 4965);
    			add_location(p5, file$j, 50, 2, 4092);
    			add_location(strong3, file$j, 55, 22, 5260);
    			attr_dev(div2, "align", "center");
    			add_location(div2, file$j, 55, 2, 5240);
    			add_location(h31, file$j, 56, 2, 5362);
    			add_location(p6, file$j, 57, 2, 5393);
    			attr_dev(img1, "width", "150");
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Qpu.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "A quantum processing unit on a chipset");
    			add_location(img1, file$j, 60, 28, 5624);
    			set_style(div3, "float", "right");
    			add_location(div3, file$j, 60, 2, 5598);
    			add_location(i2, file$j, 62, 43, 5763);
    			add_location(sup3, file$j, 62, 78, 5798);
    			add_location(i3, file$j, 62, 202, 5922);
    			add_location(i4, file$j, 62, 393, 6113);
    			add_location(i5, file$j, 62, 412, 6132);
    			add_location(i6, file$j, 62, 590, 6310);
    			add_location(p7, file$j, 61, 2, 5715);
    			add_location(i7, file$j, 65, 22, 6370);
    			add_location(i8, file$j, 65, 111, 6459);
    			add_location(p8, file$j, 64, 2, 6343);
    			attr_dev(img2, "width", "600");
    			if (!src_url_equal(img2.src, img2_src_value = "/img/ChimeraPegasus.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Dots connected by lines to represent the QPU topology of the D-Wave quantum annealers");
    			add_location(img2, file$j, 67, 22, 6651);
    			add_location(br, file$j, 67, 161, 6790);
    			add_location(sup4, file$j, 67, 368, 6997);
    			add_location(i9, file$j, 67, 165, 6794);
    			attr_dev(div4, "align", "center");
    			add_location(div4, file$j, 67, 2, 6631);
    			attr_dev(span14, "class", "emphasis");
    			add_location(span14, file$j, 69, 142, 7170);
    			attr_dev(span15, "class", "emphasis");
    			add_location(span15, file$j, 69, 177, 7205);
    			add_location(sub8, file$j, 69, 394, 7422);
    			attr_dev(span16, "class", "emphasis");
    			add_location(span16, file$j, 69, 370, 7398);
    			add_location(sub9, file$j, 69, 442, 7470);
    			attr_dev(span17, "class", "emphasis");
    			add_location(span17, file$j, 69, 418, 7446);
    			add_location(i10, file$j, 69, 516, 7544);
    			add_location(i11, file$j, 69, 667, 7695);
    			add_location(p9, file$j, 68, 2, 7023);
    			attr_dev(div5, "class", "text");
    			add_location(div5, file$j, 22, 0, 412);
    			attr_dev(hr1, "class", "svelte-v2lwi");
    			add_location(hr1, file$j, 72, 0, 8031);
    			attr_dev(h32, "class", "svelte-v2lwi");
    			add_location(h32, file$j, 74, 2, 8059);
    			add_location(li0, file$j, 76, 4, 8092);
    			add_location(i12, file$j, 77, 47, 8334);
    			add_location(li1, file$j, 77, 4, 8291);
    			add_location(i13, file$j, 78, 17, 8457);
    			add_location(li2, file$j, 78, 4, 8444);
    			add_location(i14, file$j, 79, 63, 8856);
    			add_location(li3, file$j, 79, 4, 8797);
    			add_location(ol, file$j, 75, 2, 8082);
    			attr_dev(div6, "class", "refs svelte-v2lwi");
    			add_location(div6, file$j, 73, 0, 8037);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, p0);
    			append_dev(div5, t4);
    			append_dev(div5, div1);
    			append_dev(div1, img0);
    			append_dev(div5, t5);
    			append_dev(div5, p1);
    			append_dev(div5, t7);
    			append_dev(div5, h30);
    			append_dev(div5, t9);
    			append_dev(div5, p2);
    			append_dev(p2, t10);
    			append_dev(p2, sup0);
    			append_dev(p2, t12);
    			append_dev(p2, t13);
    			append_dev(p2, t14);
    			append_dev(p2, sup1);
    			append_dev(p2, t16);
    			append_dev(p2, span0);
    			append_dev(p2, t18);
    			append_dev(p2, span1);
    			append_dev(p2, t20);
    			append_dev(p2, span2);
    			append_dev(p2, t22);
    			append_dev(p2, strong0);
    			append_dev(strong0, t23);
    			append_dev(strong0, sub0);
    			append_dev(p2, t25);
    			append_dev(p2, t26);
    			append_dev(p2, t27);
    			append_dev(p2, i0);
    			append_dev(p2, t29);
    			append_dev(p2, span3);
    			append_dev(span3, t30);
    			append_dev(span3, sub1);
    			append_dev(p2, t32);
    			append_dev(p2, span4);
    			append_dev(p2, t34);
    			append_dev(p2, span5);
    			append_dev(p2, t36);
    			append_dev(div5, t37);
    			mount_component(matrix0, div5, null);
    			append_dev(div5, t38);
    			append_dev(div5, p3);
    			append_dev(p3, t39);
    			append_dev(p3, sub2);
    			append_dev(p3, t41);
    			append_dev(div5, t42);
    			append_dev(div5, p4);
    			append_dev(p4, t43);
    			append_dev(p4, t44);
    			append_dev(p4, t45);
    			append_dev(p4, t46);
    			append_dev(p4, t47);
    			append_dev(p4, strong1);
    			append_dev(p4, t49);
    			append_dev(p4, strong2);
    			append_dev(p4, t51);
    			append_dev(p4, span6);
    			append_dev(p4, t53);
    			append_dev(p4, span7);
    			append_dev(p4, t55);
    			append_dev(p4, i1);
    			append_dev(p4, t57);
    			append_dev(p4, t58);
    			append_dev(div5, t59);
    			mount_component(matrix1_1, div5, null);
    			append_dev(div5, t60);
    			append_dev(div5, p5);
    			append_dev(p5, t61);
    			append_dev(p5, sup2);
    			append_dev(p5, t63);
    			append_dev(p5, t64);
    			append_dev(p5, t65);
    			append_dev(p5, span8);
    			append_dev(p5, t67);
    			append_dev(p5, span9);
    			append_dev(span9, t68);
    			append_dev(span9, sub3);
    			append_dev(p5, t70);
    			append_dev(p5, span10);
    			append_dev(span10, t71);
    			append_dev(span10, sub4);
    			append_dev(p5, t73);
    			append_dev(p5, span11);
    			append_dev(span11, t74);
    			append_dev(span11, sub5);
    			append_dev(p5, t76);
    			append_dev(p5, span12);
    			append_dev(span12, t77);
    			append_dev(span12, sub6);
    			append_dev(p5, t79);
    			append_dev(p5, span13);
    			append_dev(span13, t80);
    			append_dev(span13, sub7);
    			append_dev(p5, t82);
    			append_dev(div5, t83);
    			append_dev(div5, div2);
    			append_dev(div2, strong3);
    			append_dev(div5, t85);
    			append_dev(div5, h31);
    			append_dev(div5, t87);
    			append_dev(div5, p6);
    			append_dev(div5, t89);
    			append_dev(div5, div3);
    			append_dev(div3, img1);
    			append_dev(div5, t90);
    			append_dev(div5, p7);
    			append_dev(p7, t91);
    			append_dev(p7, i2);
    			append_dev(p7, t93);
    			append_dev(p7, sup3);
    			append_dev(p7, t95);
    			append_dev(p7, i3);
    			append_dev(p7, t97);
    			append_dev(p7, i4);
    			append_dev(p7, t99);
    			append_dev(p7, i5);
    			append_dev(p7, t101);
    			append_dev(p7, i6);
    			append_dev(p7, t103);
    			append_dev(div5, t104);
    			append_dev(div5, p8);
    			append_dev(p8, t105);
    			append_dev(p8, i7);
    			append_dev(p8, t107);
    			append_dev(p8, i8);
    			append_dev(p8, t109);
    			append_dev(div5, t110);
    			append_dev(div5, div4);
    			append_dev(div4, img2);
    			append_dev(div4, br);
    			append_dev(div4, i9);
    			append_dev(i9, t111);
    			append_dev(i9, sup4);
    			append_dev(div5, t113);
    			append_dev(div5, p9);
    			append_dev(p9, t114);
    			append_dev(p9, span14);
    			append_dev(p9, t116);
    			append_dev(p9, span15);
    			append_dev(p9, t118);
    			append_dev(p9, span16);
    			append_dev(span16, t119);
    			append_dev(span16, sub8);
    			append_dev(p9, t121);
    			append_dev(p9, span17);
    			append_dev(span17, t122);
    			append_dev(span17, sub9);
    			append_dev(p9, t124);
    			append_dev(p9, i10);
    			append_dev(p9, t126);
    			append_dev(p9, i11);
    			append_dev(p9, t128);
    			insert_dev(target, t129, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t130, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h32);
    			append_dev(div6, t132);
    			append_dev(div6, ol);
    			append_dev(ol, li0);
    			mount_component(link0, li0, null);
    			append_dev(li0, t133);
    			append_dev(ol, t134);
    			append_dev(ol, li1);
    			append_dev(li1, t135);
    			append_dev(li1, i12);
    			append_dev(li1, t137);
    			append_dev(ol, t138);
    			append_dev(ol, li2);
    			append_dev(li2, t139);
    			append_dev(li2, i13);
    			append_dev(li2, t141);
    			mount_component(link1, li2, null);
    			append_dev(li2, t142);
    			append_dev(ol, t143);
    			append_dev(ol, li3);
    			append_dev(li3, t144);
    			append_dev(li3, i14);
    			append_dev(li3, t146);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(matrix0.$$.fragment, local);
    			transition_in(matrix1_1.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(matrix0.$$.fragment, local);
    			transition_out(matrix1_1.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div5);
    			destroy_component(matrix0);
    			destroy_component(matrix1_1);
    			if (detaching) detach_dev(t129);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t130);
    			if (detaching) detach_dev(div6);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuantumAnnealers', slots, []);
    	const matrix1 = [[1, 4, 2, 1], [3, 0, 3, 1], [5, 1, 2, 0], [4, 1, 2, 3]];
    	const matrix2 = [[-3, 2, 2, 2], [0, -3, 2, 2], [0, 0, -3, 2], [0, 0, 0, -3]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuantumAnnealers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Matrix, matrix1, matrix2 });
    	return [matrix1, matrix2];
    }

    class QuantumAnnealers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuantumAnnealers",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare1 = f;
      let compare2 = f;

      if (f.length !== 2) {
        delta = (d, x) => f(d) - x;
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$1(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$1,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$1, identity$1);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function fade(node, { delay = 0, duration = 400, easing = identity$2 } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\shared\BarChart.svelte generated by Svelte v3.46.4 */
    const file$i = "src\\shared\\BarChart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (42:6) {#each yTicks as tick}
    function create_each_block_2(ctx) {
    	let g;
    	let line;
    	let text_1;
    	let t0_value = /*tick*/ ctx[20] + "";
    	let t0;

    	let t1_value = (/*tick*/ ctx[20] === /*yTicks*/ ctx[3][/*yTicks*/ ctx[3].length - 1]
    	? " " + /*yLabel*/ ctx[4]
    	: "") + "";

    	let t1;
    	let g_class_value;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			text_1 = svg_element("text");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			attr_dev(line, "x2", "100%");
    			attr_dev(line, "class", "svelte-wlnmjp");
    			add_location(line, file$i, 43, 10, 1119);
    			attr_dev(text_1, "y", "-4");
    			attr_dev(text_1, "class", "svelte-wlnmjp");
    			add_location(text_1, file$i, 44, 10, 1149);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[20] + " svelte-wlnmjp");
    			attr_dev(g, "transform", g_transform_value = "translate(0, " + /*yScale*/ ctx[8](/*tick*/ ctx[20]) + ")");
    			add_location(g, file$i, 42, 8, 1038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    			append_dev(g, text_1);
    			append_dev(text_1, t0);
    			append_dev(text_1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTicks*/ 8 && t0_value !== (t0_value = /*tick*/ ctx[20] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*yTicks, yLabel*/ 24 && t1_value !== (t1_value = (/*tick*/ ctx[20] === /*yTicks*/ ctx[3][/*yTicks*/ ctx[3].length - 1]
    			? " " + /*yLabel*/ ctx[4]
    			: "") + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*yTicks*/ 8 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[20] + " svelte-wlnmjp")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*yScale, yTicks*/ 264 && g_transform_value !== (g_transform_value = "translate(0, " + /*yScale*/ ctx[8](/*tick*/ ctx[20]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(42:6) {#each yTicks as tick}",
    		ctx
    	});

    	return block;
    }

    // (55:6) {#each points as point, i}
    function create_each_block_1(ctx) {
    	let g;
    	let text_1;

    	let t_value = (/*width*/ ctx[0] > 380
    	? /*point*/ ctx[16].x
    	: formatMobile(/*point*/ ctx[16].x)) + "";

    	let t;
    	let text_1_x_value;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "x", text_1_x_value = /*barWidth*/ ctx[7] / 2);
    			attr_dev(text_1, "y", "-4");
    			attr_dev(text_1, "class", "svelte-wlnmjp");
    			add_location(text_1, file$i, 56, 10, 1478);
    			attr_dev(g, "class", "tick svelte-wlnmjp");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*xScale*/ ctx[9](/*i*/ ctx[18]) + "," + /*height*/ ctx[1] + ")");
    			add_location(g, file$i, 55, 8, 1406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*width, points*/ 5 && t_value !== (t_value = (/*width*/ ctx[0] > 380
    			? /*point*/ ctx[16].x
    			: formatMobile(/*point*/ ctx[16].x)) + "")) set_data_dev(t, t_value);

    			if (dirty & /*barWidth*/ 128 && text_1_x_value !== (text_1_x_value = /*barWidth*/ ctx[7] / 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*xScale, height*/ 514 && g_transform_value !== (g_transform_value = "translate(" + /*xScale*/ ctx[9](/*i*/ ctx[18]) + "," + /*height*/ ctx[1] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(55:6) {#each points as point, i}",
    		ctx
    	});

    	return block;
    }

    // (75:8) {#if i == selectedBar}
    function create_if_block$6(ctx) {
    	let text_1;
    	let t_value = /*point*/ ctx[16].y + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			set_style(text_1, "font-size", "0.725em");
    			attr_dev(text_1, "x", text_1_x_value = /*xScale*/ ctx[9](/*i*/ ctx[18]) + 2 + (/*barWidth*/ ctx[7] - 4) / 2);
    			attr_dev(text_1, "y", text_1_y_value = /*yScale*/ ctx[8](/*point*/ ctx[16].y) - 4);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "class", "svelte-wlnmjp");
    			add_location(text_1, file$i, 75, 10, 2027);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*points*/ 4) && t_value !== (t_value = /*point*/ ctx[16].y + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*xScale, barWidth*/ 640 && text_1_x_value !== (text_1_x_value = /*xScale*/ ctx[9](/*i*/ ctx[18]) + 2 + (/*barWidth*/ ctx[7] - 4) / 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (!current || dirty & /*yScale, points*/ 260 && text_1_y_value !== (text_1_y_value = /*yScale*/ ctx[8](/*point*/ ctx[16].y) - 4)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!text_1_transition) text_1_transition = create_bidirectional_transition(text_1, fly, { y: -20, duration: 500 }, true);
    				text_1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!text_1_transition) text_1_transition = create_bidirectional_transition(text_1, fly, { y: -20, duration: 500 }, false);
    			text_1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    			if (detaching && text_1_transition) text_1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(75:8) {#if i == selectedBar}",
    		ctx
    	});

    	return block;
    }

    // (65:6) {#each points as point, i}
    function create_each_block$3(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_width_value;
    	let rect_height_value;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[12](/*i*/ ctx[18]);
    	}

    	let if_block = /*i*/ ctx[18] == /*selectedBar*/ ctx[6] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(rect, "x", rect_x_value = /*xScale*/ ctx[9](/*i*/ ctx[18]) + 2);
    			attr_dev(rect, "y", rect_y_value = /*yScale*/ ctx[8](/*point*/ ctx[16].y));
    			attr_dev(rect, "width", rect_width_value = /*barWidth*/ ctx[7] - 4);
    			attr_dev(rect, "height", rect_height_value = /*yScale*/ ctx[8](0) - /*yScale*/ ctx[8](/*point*/ ctx[16].y));
    			set_style(rect, "fill", /*barColor*/ ctx[5]);
    			attr_dev(rect, "class", "svelte-wlnmjp");
    			add_location(rect, file$i, 65, 8, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mouseenter", mouseenter_handler, false, false, false),
    					listen_dev(rect, "mouseleave", /*mouseleave_handler*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*xScale*/ 512 && rect_x_value !== (rect_x_value = /*xScale*/ ctx[9](/*i*/ ctx[18]) + 2)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (!current || dirty & /*yScale, points*/ 260 && rect_y_value !== (rect_y_value = /*yScale*/ ctx[8](/*point*/ ctx[16].y))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (!current || dirty & /*barWidth*/ 128 && rect_width_value !== (rect_width_value = /*barWidth*/ ctx[7] - 4)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (!current || dirty & /*yScale, points*/ 260 && rect_height_value !== (rect_height_value = /*yScale*/ ctx[8](0) - /*yScale*/ ctx[8](/*point*/ ctx[16].y))) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (!current || dirty & /*barColor*/ 32) {
    				set_style(rect, "fill", /*barColor*/ ctx[5]);
    			}

    			if (/*i*/ ctx[18] == /*selectedBar*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*selectedBar*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(65:6) {#each points as point, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let svg;
    	let g0;
    	let g1;
    	let g2;
    	let div_resize_listener;
    	let current;
    	let each_value_2 = /*yTicks*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*points*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*points*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			g1 = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			g2 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g0, "class", "axis y-axis");
    			add_location(g0, file$i, 40, 4, 975);
    			attr_dev(g1, "class", "axis x-axis svelte-wlnmjp");
    			add_location(g1, file$i, 53, 4, 1339);
    			attr_dev(g2, "class", "bars svelte-wlnmjp");
    			add_location(g2, file$i, 63, 4, 1635);
    			attr_dev(svg, "class", "svelte-wlnmjp");
    			add_location(svg, file$i, 38, 2, 943);
    			attr_dev(div, "class", "chart unselectable svelte-wlnmjp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[14].call(div));
    			add_location(div, file$i, 33, 0, 844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(g0, null);
    			}

    			append_dev(svg, g1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g1, null);
    			}

    			append_dev(svg, g2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g2, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[14].bind(div));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*yTicks, yScale, yLabel*/ 280) {
    				each_value_2 = /*yTicks*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(g0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*xScale, height, barWidth, width, points, formatMobile*/ 647) {
    				each_value_1 = /*points*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*xScale, barWidth, yScale, points, selectedBar, barColor, onSelected*/ 2020) {
    				each_value = /*points*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function formatMobile(tick) {
    	return "'" + tick.toString().slice(-2);
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let innerWidth;
    	let barWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BarChart', slots, []);
    	let { points } = $$props;
    	let { yTicks } = $$props;
    	let { yLabel } = $$props;
    	const padding = { top: 20, right: 0, bottom: 20, left: 25 };
    	let { width } = $$props;
    	let { height } = $$props;
    	let { barColor } = $$props;
    	let selectedBar = -1;

    	const onSelected = id => {
    		$$invalidate(6, selectedBar = id);
    	};

    	const writable_props = ['points', 'yTicks', 'yLabel', 'width', 'height', 'barColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BarChart> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = i => onSelected(i);
    	const mouseleave_handler = () => onSelected(-1);

    	function div_elementresize_handler() {
    		width = this.clientWidth;
    		height = this.clientHeight;
    		$$invalidate(0, width);
    		$$invalidate(1, height);
    	}

    	$$self.$$set = $$props => {
    		if ('points' in $$props) $$invalidate(2, points = $$props.points);
    		if ('yTicks' in $$props) $$invalidate(3, yTicks = $$props.yTicks);
    		if ('yLabel' in $$props) $$invalidate(4, yLabel = $$props.yLabel);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('barColor' in $$props) $$invalidate(5, barColor = $$props.barColor);
    	};

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		fly,
    		points,
    		yTicks,
    		yLabel,
    		padding,
    		width,
    		height,
    		barColor,
    		formatMobile,
    		selectedBar,
    		onSelected,
    		innerWidth,
    		barWidth,
    		yScale,
    		xScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('points' in $$props) $$invalidate(2, points = $$props.points);
    		if ('yTicks' in $$props) $$invalidate(3, yTicks = $$props.yTicks);
    		if ('yLabel' in $$props) $$invalidate(4, yLabel = $$props.yLabel);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('barColor' in $$props) $$invalidate(5, barColor = $$props.barColor);
    		if ('selectedBar' in $$props) $$invalidate(6, selectedBar = $$props.selectedBar);
    		if ('innerWidth' in $$props) $$invalidate(11, innerWidth = $$props.innerWidth);
    		if ('barWidth' in $$props) $$invalidate(7, barWidth = $$props.barWidth);
    		if ('yScale' in $$props) $$invalidate(8, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(9, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*points, width*/ 5) {
    			$$invalidate(9, xScale = linear().domain([0, points.length]).range([padding.left, width - padding.right]));
    		}

    		if ($$self.$$.dirty & /*yTicks, height*/ 10) {
    			$$invalidate(8, yScale = linear().domain([0, Math.max.apply(null, yTicks)]).range([height - padding.bottom, padding.top]));
    		}

    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(11, innerWidth = width - (padding.left + padding.right));
    		}

    		if ($$self.$$.dirty & /*innerWidth, points*/ 2052) {
    			$$invalidate(7, barWidth = innerWidth / points.length * 0.6);
    		}
    	};

    	return [
    		width,
    		height,
    		points,
    		yTicks,
    		yLabel,
    		barColor,
    		selectedBar,
    		barWidth,
    		yScale,
    		xScale,
    		onSelected,
    		innerWidth,
    		mouseenter_handler,
    		mouseleave_handler,
    		div_elementresize_handler
    	];
    }

    class BarChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			points: 2,
    			yTicks: 3,
    			yLabel: 4,
    			width: 0,
    			height: 1,
    			barColor: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BarChart",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*points*/ ctx[2] === undefined && !('points' in props)) {
    			console.warn("<BarChart> was created without expected prop 'points'");
    		}

    		if (/*yTicks*/ ctx[3] === undefined && !('yTicks' in props)) {
    			console.warn("<BarChart> was created without expected prop 'yTicks'");
    		}

    		if (/*yLabel*/ ctx[4] === undefined && !('yLabel' in props)) {
    			console.warn("<BarChart> was created without expected prop 'yLabel'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<BarChart> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<BarChart> was created without expected prop 'height'");
    		}

    		if (/*barColor*/ ctx[5] === undefined && !('barColor' in props)) {
    			console.warn("<BarChart> was created without expected prop 'barColor'");
    		}
    	}

    	get points() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set points(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTicks() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTicks(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yLabel() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yLabel(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get barColor() {
    		throw new Error("<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barColor(value) {
    		throw new Error("<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var data = {
        points: [
            { x: 1990, y: 16.7 },
            { x: 1995, y: 14.6 },
            { x: 2000, y: 14.4 },
            { x: 2007, y: 14 },
            { x: 2010, y: 13 },
            { x: 2015, y: 12.4 },
        ],
        yTicks: [0, 5, 10, 15, 20]
    };

    /* src\components\lessons\Demo.svelte generated by Svelte v3.46.4 */
    const file$h = "src\\components\\lessons\\Demo.svelte";

    function create_fragment$h(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let p3;
    	let t10;
    	let barchart;
    	let t11;
    	let p4;
    	let t13;
    	let matrix;
    	let t14;
    	let p5;
    	let t16;
    	let graph;
    	let current;

    	barchart = new BarChart({
    			props: {
    				points: data.points,
    				yTicks: data.yTicks,
    				yLabel: "per 1,000 population",
    				width: "400",
    				height: "300",
    				barColor: "#f1b6e8"
    			},
    			$$inline: true
    		});

    	matrix = new Matrix({
    			props: {
    				size: "300",
    				data: /*matrix1*/ ctx[0],
    				showLabels: true
    			},
    			$$inline: true
    		});

    	graph = new Graph({
    			props: {
    				graph: data2,
    				width: "500",
    				height: "350",
    				style: "display: block; margin: 0 auto;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "[TEMP] Demo card";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Sample text: Lorem, ipsum dolor sit amet consectetur adipisicing elit.\r\n    Nostrum voluptatibus, inventore totam fuga quibusdam reprehenderit?\r\n    Repudiandae consequuntur voluptate delectus laboriosam expedita fugiat\r\n    temporibus itaque inventore sint adipisci, id eos soluta assumenda quis a\r\n    impedit, aperiam maxime, doloribus repellendus fugit. Voluptates earum\r\n    voluptate maxime quas corrupti facilis harum consequuntur repudiandae\r\n    deleniti!";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Here is a sample formula:";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = `${`$$C\\left(x\\right)=\\sum_{i=1}^Na_ix_i+\\sum_{i<j}b_{ij}x_ix_j$$`}`;
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "Here is an animated bar chart:";
    			t10 = space();
    			create_component(barchart.$$.fragment);
    			t11 = space();
    			p4 = element("p");
    			p4.textContent = "Here is an interactive matrix:";
    			t13 = space();
    			create_component(matrix.$$.fragment);
    			t14 = space();
    			p5 = element("p");
    			p5.textContent = "Here is a graph:";
    			t16 = space();
    			create_component(graph.$$.fragment);
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$h, 16, 2, 402);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$h, 15, 0, 379);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$h, 18, 0, 437);
    			add_location(p0, file$h, 20, 2, 467);
    			add_location(p1, file$h, 29, 2, 952);
    			add_location(p2, file$h, 30, 2, 988);
    			add_location(p3, file$h, 31, 2, 1068);
    			add_location(p4, file$h, 40, 2, 1274);
    			add_location(p5, file$h, 42, 2, 1373);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$h, 19, 0, 445);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, p2);
    			append_dev(div1, t8);
    			append_dev(div1, p3);
    			append_dev(div1, t10);
    			mount_component(barchart, div1, null);
    			append_dev(div1, t11);
    			append_dev(div1, p4);
    			append_dev(div1, t13);
    			mount_component(matrix, div1, null);
    			append_dev(div1, t14);
    			append_dev(div1, p5);
    			append_dev(div1, t16);
    			mount_component(graph, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(barchart.$$.fragment, local);
    			transition_in(matrix.$$.fragment, local);
    			transition_in(graph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(barchart.$$.fragment, local);
    			transition_out(matrix.$$.fragment, local);
    			transition_out(graph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(barchart);
    			destroy_component(matrix);
    			destroy_component(graph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demo', slots, []);
    	const matrix1 = [[0, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Matrix,
    		BarChart,
    		Graph,
    		data,
    		data2,
    		matrix1
    	});

    	return [matrix1];
    }

    class Demo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    //500 x 350

    var data1$1 = {
    	"nodes": [
    	  	{"id": "A", "x": 21, "y": 335},
    	  	{"id": "B", "x": 298, "y": 44},
    	  	{"id": "C", "x": 91, "y": 95},
    		{"id": "D", "x": 479, "y": 184},
    	],
    	"links": [
    		{"source": [21, 335], "target": [298, 44], "value": 6.6, "highlight": true},
            {"source": [21, 335], "target": [91, 95], "value": 5.4, "highlight": true},
            {"source": [21, 335], "target": [479, 184], "value": 4.1, "highlight": false},
            {"source": [298, 44], "target": [91, 95], "value": 1.6, "highlight": false},
            {"source": [298, 44], "target": [479, 184], "value": 3.6, "highlight": true},
            {"source": [91, 95], "target": [479, 184], "value": 3.2, "highlight": true},
    	]
      };

    /* src\components\lessons\TSPQuantum.svelte generated by Svelte v3.46.4 */
    const file$g = "src\\components\\lessons\\TSPQuantum.svelte";

    function create_fragment$g(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let graph;
    	let t7;
    	let p2;
    	let t8;
    	let span0;
    	let t10;
    	let strong;
    	let t12;
    	let t13;
    	let h3;
    	let t15;
    	let p3;
    	let t17;
    	let ol;
    	let li0;
    	let t19;
    	let li1;
    	let t21;
    	let p4;
    	let t23;
    	let matrix;
    	let t24;
    	let p5;
    	let t25;
    	let span1;
    	let t27;
    	let span2;
    	let t28;
    	let sub;
    	let t30;
    	let span3;
    	let t32;
    	let span4;
    	let t34;
    	let i;
    	let t36;
    	let t37;
    	let p6;
    	let t38;
    	let span5;
    	let t40;
    	let current;

    	graph = new Graph({
    			props: {
    				graph: data1$1,
    				width: "500",
    				height: "350",
    				style: "display: block; margin: 0 auto;"
    			},
    			$$inline: true
    		});

    	matrix = new Matrix({
    			props: {
    				size: "300",
    				data: /*matrix1*/ ctx[0],
    				showLabels: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Transforming the Traveling Salesman Problem for quantum annealers";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Now, we have arrived at the main part of the course. Creating a quantum solution for the TSP is an exciting example of the versatility of quantum computing as well as a demonstration of how it can help improve everyday tasks. The first step towards such a method is the question of how to transform the core component of the TSP, the graph, into a QUBO problem.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "As shown in the previous sections, the easiest way of creating QUBO problems is through a square field with numbered cells. Let's consider the simplest instance of the TSP, a graph of four cities (since this is the minimum number of vertices that allows different solutions than the optimum):";
    			t6 = space();
    			create_component(graph.$$.fragment);
    			t7 = space();
    			p2 = element("p");
    			t8 = text("If we consider ");
    			span0 = element("span");
    			span0.textContent = "A";
    			t10 = text(" as a starting point, here our tour is ");
    			strong = element("strong");
    			strong.textContent = "A -> B -> D -> C -> A";
    			t12 = text(" (of course, the inverse A -> C -> D -> B -> A is valid, too). How can we transform this data structure to a number field?");
    			t13 = space();
    			h3 = element("h3");
    			h3.textContent = "The Tour Matrix";
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "A possible tour is characterized by two parts of information:";
    			t17 = space();
    			ol = element("ol");
    			li0 = element("li");
    			li0.textContent = "The chronological order of the visited cities";
    			t19 = space();
    			li1 = element("li");
    			li1.textContent = "The total cost of the route, i.e. the sum of the length of the edges taken";
    			t21 = space();
    			p4 = element("p");
    			p4.textContent = "By using a matrix, the mathematical concept previously discussed, it is possible to address the first point. Applied to the graph above, the result is this:";
    			t23 = space();
    			create_component(matrix.$$.fragment);
    			t24 = space();
    			p5 = element("p");
    			t25 = text("The rows represent the individual cities, while the columns mark the \"points in time\", i.e. each step made. An entry of ");
    			span1 = element("span");
    			span1.textContent = "1";
    			t27 = text(" in the field ");
    			span2 = element("span");
    			t28 = text("a");
    			sub = element("sub");
    			sub.textContent = "ij";
    			t30 = text(" means that the ");
    			span3 = element("span");
    			span3.textContent = "i";
    			t32 = text("-th city is visited in the ");
    			span4 = element("span");
    			span4.textContent = "j";
    			t34 = text("-th time step. The fifth time step would mark the return to the starting city, but since it would always be an exact copy of the first column, it can be omitted to minimize the data. Now, we have created an abstraction that can be applied to tours in graphs of any size. Let's name this new structure ");
    			i = element("i");
    			i.textContent = "tour matrix";
    			t36 = text(".");
    			t37 = space();
    			p6 = element("p");
    			t38 = text("Perhaps, you can already see where this is going: Indeed, this looks very similar to the \"checkers\" example from Section 2. You can think of the ");
    			span5 = element("span");
    			span5.textContent = "1";
    			t40 = text("s as the pieces that can be placed on a board to mark which city belongs to which time step. So next, we're going to explore how to extract the QUBO equation.");
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$g, 14, 2, 303);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$g, 13, 0, 280);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$g, 16, 0, 387);
    			add_location(p0, file$g, 18, 2, 417);
    			add_location(p1, file$g, 21, 2, 799);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$g, 26, 19, 1227);
    			add_location(strong, file$g, 26, 89, 1297);
    			add_location(p2, file$g, 25, 2, 1203);
    			add_location(h3, file$g, 28, 2, 1469);
    			add_location(p3, file$g, 29, 2, 1497);
    			add_location(li0, file$g, 33, 4, 1589);
    			add_location(li1, file$g, 34, 4, 1649);
    			add_location(ol, file$g, 32, 2, 1579);
    			add_location(p4, file$g, 36, 2, 1745);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$g, 41, 124, 2108);
    			add_location(sub, file$g, 41, 193, 2177);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$g, 41, 169, 2153);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$g, 41, 229, 2213);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$g, 41, 287, 2271);
    			add_location(i, file$g, 41, 619, 2603);
    			add_location(p5, file$g, 40, 2, 1979);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$g, 44, 149, 2788);
    			add_location(p6, file$g, 43, 2, 2634);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$g, 17, 0, 395);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			mount_component(graph, div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(p2, t8);
    			append_dev(p2, span0);
    			append_dev(p2, t10);
    			append_dev(p2, strong);
    			append_dev(p2, t12);
    			append_dev(div1, t13);
    			append_dev(div1, h3);
    			append_dev(div1, t15);
    			append_dev(div1, p3);
    			append_dev(div1, t17);
    			append_dev(div1, ol);
    			append_dev(ol, li0);
    			append_dev(ol, t19);
    			append_dev(ol, li1);
    			append_dev(div1, t21);
    			append_dev(div1, p4);
    			append_dev(div1, t23);
    			mount_component(matrix, div1, null);
    			append_dev(div1, t24);
    			append_dev(div1, p5);
    			append_dev(p5, t25);
    			append_dev(p5, span1);
    			append_dev(p5, t27);
    			append_dev(p5, span2);
    			append_dev(span2, t28);
    			append_dev(span2, sub);
    			append_dev(p5, t30);
    			append_dev(p5, span3);
    			append_dev(p5, t32);
    			append_dev(p5, span4);
    			append_dev(p5, t34);
    			append_dev(p5, i);
    			append_dev(p5, t36);
    			append_dev(div1, t37);
    			append_dev(div1, p6);
    			append_dev(p6, t38);
    			append_dev(p6, span5);
    			append_dev(p6, t40);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph.$$.fragment, local);
    			transition_in(matrix.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph.$$.fragment, local);
    			transition_out(matrix.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(graph);
    			destroy_component(matrix);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TSPQuantum', slots, []);
    	const matrix1 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TSPQuantum> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Graph, Matrix, data1: data1$1, matrix1 });
    	return [matrix1];
    }

    class TSPQuantum extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TSPQuantum",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\lessons\QUBOFormulating.svelte generated by Svelte v3.46.4 */
    const file$f = "src\\components\\lessons\\QUBOFormulating.svelte";

    function create_fragment$f(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div3;
    	let p0;
    	let t4;
    	let ol;
    	let li0;
    	let t6;
    	let li1;
    	let t8;
    	let p1;
    	let t10;
    	let matrix;
    	let t11;
    	let p2;
    	let t23;
    	let p3;
    	let t24;
    	let i0;
    	let t26;
    	let i1;
    	let t27;
    	let sup;
    	let t29;
    	let t30;
    	let div1;
    	let img;
    	let img_src_value;
    	let t31;
    	let p4;
    	let t32;
    	let span0;
    	let t34;
    	let span1;
    	let t36;
    	let span2;
    	let t38;
    	let span3;
    	let t40;
    	let span4;
    	let t42;
    	let span5;
    	let t44;
    	let span6;
    	let t46;
    	let span7;
    	let t48;
    	let t49_value = `$$6.6af+6.6bg+6.6ch+6.6de+5.4aj+5.4bk+5.4cl+5.4di+4.0an+4.0bo+4.0cp+4.0dm+6.6eb+6.6fc$$` + "";
    	let t49;
    	let t50;
    	let t51_value = `$$+6.6gd+6.6ha+1.6ej+1.6fk+1.6gl+1.6hi+3.6en+3.6fo+3.6gp+3.6hm+5.4ib+5.4jc+5.4kd+5.4la$$` + "";
    	let t51;
    	let t52;
    	let t53_value = `$$+1.6if+1.6jg+1.6kh+1.6le+3.2in+3.2jo+3.2kp+3.2lm+4.0mb+4.0nc+4.0od+4.0pa+3.6mf+3.6ng$$` + "";
    	let t53;
    	let t54;
    	let t55_value = `$$+3.6oh+3.6pe+3.2mj+3.2nk+3.2ol+3.2pi$$` + "";
    	let t55;
    	let t56;
    	let i2;
    	let t58;
    	let t59;
    	let div2;
    	let strong;
    	let current;

    	matrix = new Matrix({
    			props: {
    				data: /*matrix1*/ ctx[0],
    				size: "200",
    				showLabels: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Formulating the QUBO equation";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div3 = element("div");
    			p0 = element("p");
    			p0.textContent = "From the example tour matrix in the previous lesson, the following rules for occupancy can be derived:";
    			t4 = space();
    			ol = element("ol");
    			li0 = element("li");
    			li0.textContent = "Exactly one occupation per row is allowed (since it is not possible to visit a city more than once)";
    			t6 = space();
    			li1 = element("li");
    			li1.textContent = "Exactly one occupation per column is allowed (since it is not possible to visit multiple cities at the same time)";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "In this 4x4 grid, the cells are named in alphabetical order. For four cities, the QUBO equation is formulated as follows:";
    			t10 = space();
    			create_component(matrix.$$.fragment);
    			t11 = space();
    			p2 = element("p");

    			p2.textContent = `${`$$f\\left(a,...,p\\right)=\\left(a+b+c+d-1\\right)^2+\\left(e+f+g+h-1\\right)^2+\\left(i+j+k+l-1\\right)^2+\\left(m+n+o+p-1\\right)^2$$`} 
    ${`$$+\\left(a+e+i+m-1\\right)^2+\\left(b+f+j+n-1\\right)^2+\\left(c+g+k+o-1\\right)^2+\\left(d+h+l+p-1\\right)^2$$`} 
    ${`$$=-2a+2ab+2ac+2ad+2ae+2ai+2am-2b+2bc+2bd+2bf+2bj+2bn-2c+2cd+2cg+2ck+2co$$`} 
    ${`$$-2d+2dh+2dl+2dp-2e+2ef+2eg+2eh+2ei+2em-2f+2fg+2fh+2fj+2fn-2g+2gh+2gk+2go$$`} 
    ${`$$-2h+2hl+2hp-2i+2ij+2ik+2il+2im-2j+2jk+2jl+2jn-2k+2kl+2ko-2l+2lp-2m+2mn+2mo+2mp$$`} 
    ${`$$-2n+2no+2np-2o+2op-2p+8$$`}`;

    			t23 = space();
    			p3 = element("p");
    			t24 = text("This is a massive and unhandy equation, but a valid cost function since only the correct occupations yield the lowest cost. Since it depends on the number of cities ");
    			i0 = element("i");
    			i0.textContent = "n";
    			t26 = text(", the QUBO equation takes ");
    			i1 = element("i");
    			t27 = text("n");
    			sup = element("sup");
    			sup.textContent = "2";
    			t29 = text(" variables as its input (meaning it grows at a quadratic rate) and must be reformulated for every individual TSP instance. But this is only half of the story. In order to quantify the second key information of the tours, the route cost must also be considered in the QUBO equation. Luckily, since it is a cost function as well, the values can be adopted and added to the total cost as is. But how to determine which ones to add and when? Consider the following example:");
    			t30 = space();
    			div1 = element("div");
    			img = element("img");
    			t31 = space();
    			p4 = element("p");
    			t32 = text("A given edge is taken if its initial vertex is marked in one column and its destination vertex in the following column. Here, the arrows denote all edges that go from ");
    			span0 = element("span");
    			span0.textContent = "B";
    			t34 = text(" to the other vertices. Since we initially don't know when we're going to visit ");
    			span1 = element("span");
    			span1.textContent = "B";
    			t36 = text(", this has to be repeated for all time steps. For example, the edge ");
    			span2 = element("span");
    			span2.textContent = "BA";
    			t38 = text(" with the cost of 6.6 is corresponding with ");
    			span3 = element("span");
    			span3.textContent = "(e, b)";
    			t40 = text(", ");
    			span4 = element("span");
    			span4.textContent = "(f, c)";
    			t42 = text(", ");
    			span5 = element("span");
    			span5.textContent = "(g, d)";
    			t44 = text(", and ");
    			span6 = element("span");
    			span6.textContent = "(h, a)";
    			t46 = text(". If we multiply this cost with those pairs of variables (this is compliant with the rules of QUBO problems), it is only added if both fields are visited, i.e. equal to ");
    			span7 = element("span");
    			span7.textContent = "1";
    			t48 = text(". Additionally, there is no danger of adding the cost of a specific edge more than once because, since it is forbidden to visit a city more than once, only one of these four cases will ever occur, if any. So this is what the second half of the QUBO equation looks like:\r\n    ");
    			t49 = text(t49_value);
    			t50 = space();
    			t51 = text(t51_value);
    			t52 = space();
    			t53 = text(t53_value);
    			t54 = space();
    			t55 = text(t55_value);
    			t56 = text("\r\n    This part just gets added to the rest of the equation and must also be re-generated for every TSP instance. Now, this cost function will yield the best (lowest) energy if the formal rules of occupancy, i.e. 1/row and 1/column are satisfied ");
    			i2 = element("i");
    			i2.textContent = "and";
    			t58 = text(" the quantum annealer chooses those connections whose sum is minimal, according to the TSP requirements (keep this statement in mind; we will discuss in the next section why this isn't that simple).");
    			t59 = space();
    			div2 = element("div");
    			strong = element("strong");
    			strong.textContent = "We've successfully turned the Traveling Salesman problem into an annealer-compatible QUBO problem!";
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$f, 15, 2, 383);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$f, 14, 0, 360);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$f, 17, 0, 431);
    			add_location(p0, file$f, 19, 2, 461);
    			add_location(li0, file$f, 23, 4, 594);
    			add_location(li1, file$f, 24, 4, 708);
    			add_location(ol, file$f, 22, 2, 584);
    			add_location(p1, file$f, 26, 2, 843);
    			add_location(p2, file$f, 30, 2, 1041);
    			add_location(i0, file$f, 39, 169, 1796);
    			add_location(sup, file$f, 39, 207, 1834);
    			add_location(i1, file$f, 39, 203, 1830);
    			add_location(p3, file$f, 38, 2, 1622);
    			attr_dev(img, "width", "220");
    			if (!src_url_equal(img.src, img_src_value = "/img/MatrixArrows.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "A Tour Matrix where from each node, arrows point to all possible destinations in the next timestamp");
    			add_location(img, file$f, 41, 22, 2351);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$f, 41, 2, 2331);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$f, 43, 171, 2688);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$f, 43, 282, 2799);
    			set_style(span2, "text-decoration", "overline");
    			add_location(span2, file$f, 43, 381, 2898);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$f, 43, 474, 2991);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$f, 43, 512, 3029);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$f, 43, 550, 3067);
    			attr_dev(span6, "class", "emphasis");
    			add_location(span6, file$f, 43, 592, 3109);
    			attr_dev(span7, "class", "emphasis");
    			add_location(span7, file$f, 43, 797, 3314);
    			add_location(i2, file$f, 48, 244, 4203);
    			add_location(p4, file$f, 42, 2, 2512);
    			add_location(strong, file$f, 50, 22, 4443);
    			attr_dev(div2, "align", "center");
    			add_location(div2, file$f, 50, 2, 4423);
    			attr_dev(div3, "class", "text");
    			add_location(div3, file$f, 18, 0, 439);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p0);
    			append_dev(div3, t4);
    			append_dev(div3, ol);
    			append_dev(ol, li0);
    			append_dev(ol, t6);
    			append_dev(ol, li1);
    			append_dev(div3, t8);
    			append_dev(div3, p1);
    			append_dev(div3, t10);
    			mount_component(matrix, div3, null);
    			append_dev(div3, t11);
    			append_dev(div3, p2);
    			append_dev(div3, t23);
    			append_dev(div3, p3);
    			append_dev(p3, t24);
    			append_dev(p3, i0);
    			append_dev(p3, t26);
    			append_dev(p3, i1);
    			append_dev(i1, t27);
    			append_dev(i1, sup);
    			append_dev(p3, t29);
    			append_dev(div3, t30);
    			append_dev(div3, div1);
    			append_dev(div1, img);
    			append_dev(div3, t31);
    			append_dev(div3, p4);
    			append_dev(p4, t32);
    			append_dev(p4, span0);
    			append_dev(p4, t34);
    			append_dev(p4, span1);
    			append_dev(p4, t36);
    			append_dev(p4, span2);
    			append_dev(p4, t38);
    			append_dev(p4, span3);
    			append_dev(p4, t40);
    			append_dev(p4, span4);
    			append_dev(p4, t42);
    			append_dev(p4, span5);
    			append_dev(p4, t44);
    			append_dev(p4, span6);
    			append_dev(p4, t46);
    			append_dev(p4, span7);
    			append_dev(p4, t48);
    			append_dev(p4, t49);
    			append_dev(p4, t50);
    			append_dev(p4, t51);
    			append_dev(p4, t52);
    			append_dev(p4, t53);
    			append_dev(p4, t54);
    			append_dev(p4, t55);
    			append_dev(p4, t56);
    			append_dev(p4, i2);
    			append_dev(p4, t58);
    			append_dev(div3, t59);
    			append_dev(div3, div2);
    			append_dev(div2, strong);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(matrix.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(matrix.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			destroy_component(matrix);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QUBOFormulating', slots, []);

    	const matrix1 = [
    		["a", "b", "c", "d"],
    		["e", "f", "g", "h"],
    		["i", "j", "k", "l"],
    		["m", "n", "o", "p"]
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QUBOFormulating> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Graph, Matrix, data1: data1$1, matrix1 });
    	return [matrix1];
    }

    class QUBOFormulating extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QUBOFormulating",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    //500 x 350

    var data1 = {
    	"nodes": [
    	  	{"id": "A", "x": 21, "y": 335},
    	  	{"id": "B", "x": 298, "y": 44},
    	  	{"id": "C", "x": 91, "y": 95},
    		{"id": "D", "x": 479, "y": 184},
    	],
    	"links": [
    		{"source": [21, 335], "target": [298, 44], "value": 6.6, "highlight": false},
            {"source": [21, 335], "target": [91, 95], "value": 5.4, "highlight": true},
            {"source": [21, 335], "target": [479, 184], "value": 4.1, "highlight": true},
            {"source": [298, 44], "target": [91, 95], "value": 1.6, "highlight": true},
            {"source": [298, 44], "target": [479, 184], "value": 3.6, "highlight": true},
            {"source": [91, 95], "target": [479, 184], "value": 3.2, "highlight": false},
    	]
      };

    /* src\components\lessons\CoefficientsToMatrix.svelte generated by Svelte v3.46.4 */
    const file$e = "src\\components\\lessons\\CoefficientsToMatrix.svelte";

    function create_fragment$e(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div3;
    	let p0;
    	let t6;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let p1;
    	let t8;
    	let span0;
    	let t10;
    	let span1;
    	let t12;
    	let t13_value = `$$c = \\pm \\frac{3s}{n}$$` + "";
    	let t13;
    	let t14;
    	let span2;
    	let t16;
    	let t17;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t18;
    	let h3;
    	let t20;
    	let p2;
    	let t21;
    	let span3;
    	let t23;
    	let t24_value = `$$q_A=\\left[0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0\\right]\\Rightarrow$$` + "";
    	let t24;
    	let t25;
    	let matrix;
    	let t26;
    	let p3;
    	let t27;
    	let span4;
    	let i;
    	let t28;
    	let sub;
    	let t30;
    	let span5;
    	let t32;
    	let span6;
    	let t34;
    	let strong;
    	let t36;
    	let t37;
    	let graph;
    	let current;

    	matrix = new Matrix({
    			props: {
    				data: /*matrix1*/ ctx[0],
    				size: "200",
    				showLabels: true
    			},
    			$$inline: true
    		});

    	graph = new Graph({
    			props: {
    				graph: data1,
    				width: "500",
    				height: "350",
    				style: "display: block; margin: 0 auto;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "From coefficients to the Hamiltonian";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div3 = element("div");
    			p0 = element("p");

    			p0.textContent = `It's time to assemble: As discussed in Chapter 2, the coefficients from the QUBO equation need to be transferred to the Hamiltonian in order to be a valid input for the quantum annealer. The result of our calculations is a pretty massive matrix of the size 16x16 from which an excerpt is shown below:
    ${`$$H=\\begin{bmatrix}h_a & h_{ab} & h_{ac} & h_{ad} & h_{ae} & h_{af} & h_{ag} & h_{ah} & \\cdots & h_{ap} \\\\ 0 & h_{b} & h_{bc} & h_{bd} & h_{be} & h_{bf} & h_{bg} & h_{bh} & \\cdots & h_{bp} \\\\ 0 & 0 & h_{c} & h_{cd} & h_{ce} & h_{cf} & h_{cg} & h_{ch} & \\cdots & h_{cp} \\\\ 0 & 0 & 0 & h_{d} & h_{de} & h_{df} & h_{dg} & h_{dh} & \\cdots & h_{dp} \\\\ 0 & 0 & 0 & 0 & h_{e} & h_{ef} & h_{eg} & h_{eh} & \\cdots & h_{ep} \\\\ 0 & 0 & 0 & 0 & 0 & h_{f} & h_{fg} & h_{fh} & \\cdots & h_{fp} \\\\ 0 & 0 & 0 & 0 & 0 & 0 & h_{g} & h_{gh} & \\cdots & h_{gp} \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & h_{h} & \\cdots & h_{hp} \\\\ \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & \\cdots & h_{p}\\end{bmatrix}=\\begin{bmatrix}-2 & 2 & 2 & 2 & 2 & 6.6 & 0 & 6.6 & \\cdots & 4 \\\\ 0 & -2 & 2 & 2 & 6.6 & 2 & 6.6 & 0 & \\cdots & 0 \\\\ 0 & 0 & -2 & 2 & 0 & 6.6 & 2 & 6.6 & \\cdots & 4 \\\\ 0 & 0 & 0 & -2 & 6.6 & 0 & 6.6 & 2 & \\cdots & 2 \\\\ 0 & 0 & 0 & 0 & -2 & 2 & 2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & -2 & 2 & 2 & \\cdots & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & -2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & -2 & \\cdots & 2 \\\\ \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & \\cdots & -2\\end{bmatrix}$$`}
    So the problem is solved, right? Unfortunately, not quite. There is one issue left we have to talk about: the scaling. If we try to send this Hamiltonian to the quantum annealer, the results are the following:`;

    			t6 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t7 = space();
    			p1 = element("p");
    			t8 = text("The table shows the top 5 from the results of the D-Wave annealer (which are sorted from best to worst). A good portion, if not all of them visit only three or even less cities. This is because the coefficients that enforce the annealer to follow the rule \"Exactly one occupation per row/column\" are -2 or 2 and therefore too small compared to the distances between the vertices that range from 3 to 7. If the annealer occupies less cells, the energy it saves by omitting edges far outweighs the punishment it receives for visiting less cities. To fix this problem, we have to scale our coefficients accordingly: If we multiply all coefficients by the same factor, the relations are preserved, which means that we can scale certain parts of the equation to emphasize them more. As a general rule of thumb, if ");
    			span0 = element("span");
    			span0.textContent = "s";
    			t10 = text(" = the length of the longest possible tour in the graph and ");
    			span1 = element("span");
    			span1.textContent = "n";
    			t12 = text(" = the number of cities, all coefficients that enforce the first rule should be calculated as follows:\r\n    ");
    			t13 = text(t13_value);
    			t14 = text("\r\n    Now, our Hamiltonian solves the TSP correctly for all sizes! Here is a visualization of the Hamilton matrix for a big TSP with ");
    			span2 = element("span");
    			span2.textContent = "n = 8";
    			t16 = text(":");
    			t17 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t18 = space();
    			h3 = element("h3");
    			h3.textContent = "How to evaluate the results";
    			t20 = space();
    			p2 = element("p");
    			t21 = text("The updated Hamiltonian of the ");
    			span3 = element("span");
    			span3.textContent = "n = 4";
    			t23 = text(" example from Lesson 5 now yields the following solution:\r\n    ");
    			t24 = text(t24_value);
    			t25 = space();
    			create_component(matrix.$$.fragment);
    			t26 = space();
    			p3 = element("p");
    			t27 = text("Now we have to reverse-engineer the tour on the graph: The answer vector ");
    			span4 = element("span");
    			i = element("i");
    			t28 = text("q");
    			sub = element("sub");
    			sub.textContent = "A";
    			t30 = text(" (which contains the values of the variables ");
    			span5 = element("span");
    			span5.textContent = "a";
    			t32 = text(" through ");
    			span6 = element("span");
    			span6.textContent = "n";
    			t34 = text(") first has to be translated to the tour matrix by transferring the values one-by-one to a 4x4 grid. By attaching the timestep and city labels of the tour matrix, the order of the visited cities becomes visible: ");
    			strong = element("strong");
    			strong.textContent = "D -> B -> C -> A (-> D)";
    			t36 = text(". Let's look at the graph again: Indeed, it found the shortest path!");
    			t37 = space();
    			create_component(graph.$$.fragment);
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$e, 14, 2, 328);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$e, 13, 0, 305);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$e, 16, 0, 383);
    			add_location(p0, file$e, 18, 2, 413);
    			set_style(img0, "width", "40%");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Results.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "A list of responses from the quantum annealer where each solution traverses only three cities instead of four");
    			add_location(img0, file$e, 23, 22, 2365);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$e, 23, 2, 2345);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$e, 25, 813, 3356);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$e, 25, 904, 3447);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$e, 27, 131, 3749);
    			add_location(p1, file$e, 24, 2, 2538);
    			set_style(img1, "width", "25%");
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Visualization.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "A visualization of a 64x64 Hamiltonian where the values are represented with different colors");
    			add_location(img1, file$e, 29, 22, 3817);
    			attr_dev(div2, "align", "center");
    			add_location(div2, file$e, 29, 2, 3797);
    			add_location(h3, file$e, 30, 2, 3980);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$e, 32, 35, 4060);
    			add_location(p2, file$e, 31, 2, 4020);
    			add_location(sub, file$e, 37, 104, 4420);
    			add_location(i, file$e, 37, 100, 4416);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$e, 37, 77, 4393);
    			attr_dev(span5, "class", "emphasis");
    			add_location(span5, file$e, 37, 172, 4488);
    			attr_dev(span6, "class", "emphasis");
    			add_location(span6, file$e, 37, 212, 4528);
    			add_location(strong, file$e, 37, 455, 4771);
    			add_location(p3, file$e, 36, 2, 4311);
    			attr_dev(div3, "class", "text");
    			add_location(div3, file$e, 17, 0, 391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p0);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			append_dev(p1, t8);
    			append_dev(p1, span0);
    			append_dev(p1, t10);
    			append_dev(p1, span1);
    			append_dev(p1, t12);
    			append_dev(p1, t13);
    			append_dev(p1, t14);
    			append_dev(p1, span2);
    			append_dev(p1, t16);
    			append_dev(div3, t17);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div3, t18);
    			append_dev(div3, h3);
    			append_dev(div3, t20);
    			append_dev(div3, p2);
    			append_dev(p2, t21);
    			append_dev(p2, span3);
    			append_dev(p2, t23);
    			append_dev(p2, t24);
    			append_dev(div3, t25);
    			mount_component(matrix, div3, null);
    			append_dev(div3, t26);
    			append_dev(div3, p3);
    			append_dev(p3, t27);
    			append_dev(p3, span4);
    			append_dev(span4, i);
    			append_dev(i, t28);
    			append_dev(i, sub);
    			append_dev(p3, t30);
    			append_dev(p3, span5);
    			append_dev(p3, t32);
    			append_dev(p3, span6);
    			append_dev(p3, t34);
    			append_dev(p3, strong);
    			append_dev(p3, t36);
    			append_dev(div3, t37);
    			mount_component(graph, div3, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(matrix.$$.fragment, local);
    			transition_in(graph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(matrix.$$.fragment, local);
    			transition_out(graph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			destroy_component(matrix);
    			destroy_component(graph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CoefficientsToMatrix', slots, []);
    	const matrix1 = [[0, 0, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CoefficientsToMatrix> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Matrix, Graph, data1, matrix1 });
    	return [matrix1];
    }

    class CoefficientsToMatrix extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CoefficientsToMatrix",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\lessons\HowToDesign.svelte generated by Svelte v3.46.4 */

    const file$d = "src\\components\\lessons\\HowToDesign.svelte";

    function create_fragment$d(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div2;
    	let p0;
    	let t3;
    	let strong0;
    	let t5;
    	let t6;
    	let p1;
    	let t7;
    	let span0;
    	let t9;
    	let strong1;
    	let t11;
    	let t12;
    	let ol;
    	let li0;
    	let t13;
    	let span1;
    	let t15;
    	let t16;
    	let li1;
    	let t17;
    	let span2;
    	let t19;
    	let t20;
    	let li2;
    	let t21;
    	let span3;
    	let t23;
    	let t24;
    	let p2;
    	let t25;
    	let span4;
    	let t27;
    	let t28;
    	let div1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "How to design your own graphs";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text("Of course, small problem sizes like this are not really exciting; It's time to take on some major ones! Now that you successfully completed this course, you can have fun experimenting with bigger or even self-designed TSPs. The ");
    			strong0 = element("strong");
    			strong0.textContent = "Demo";
    			t5 = text(" tab on the top of the page provides example code and instructions on how to interact with the D-Wave quantum annealers. Coding is not a requirement in these lessons, but even if you have little experience, just give it a try!");
    			t6 = space();
    			p1 = element("p");
    			t7 = text("If you want to submit your own networks to the quantum annealer, you need to convert them to the Hamiltonian first. The tool ");
    			span0 = element("span");
    			span0.textContent = "Graph to Matrix";
    			t9 = text(", which can be accessed in the ");
    			strong1 = element("strong");
    			strong1.textContent = "Downloads";
    			t11 = text(" tab, generates a Hamiltonian from a graph input so you don't have to calculate it by hand.");
    			t12 = space();
    			ol = element("ol");
    			li0 = element("li");
    			t13 = text("Draw your vertices on a canvas and click ");
    			span1 = element("span");
    			span1.textContent = "Generate";
    			t15 = text(" to calculate the edges; the distance in pixels between each vertex represents the cost of the corresponding edge.");
    			t16 = space();
    			li1 = element("li");
    			t17 = text("The Hamiltonian is created automatically with the correct scaling. Click ");
    			span2 = element("span");
    			span2.textContent = "Save Hamiltonian...";
    			t19 = text(" to save it on your computer in the NumPy matrix format.");
    			t20 = space();
    			li2 = element("li");
    			t21 = text("Click ");
    			span3 = element("span");
    			span3.textContent = "Save Vertices...";
    			t23 = text(" to save the layout of your graph; this is needed later for evaluating the results.");
    			t24 = space();
    			p2 = element("p");
    			t25 = text("If you want to visualize the results, download the tool ");
    			span4 = element("span");
    			span4.textContent = "Path Visualizer";
    			t27 = text(" that reads the results of the annealer and recreates the corresponding paths. You can browse between the solutions and compare their energy in the debug terminal.");
    			t28 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$d, 5, 2, 48);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$d, 4, 0, 25);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$d, 7, 0, 96);
    			set_style(strong0, "color", "#2eb6e8");
    			add_location(strong0, file$d, 10, 232, 363);
    			add_location(p0, file$d, 9, 2, 126);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$d, 13, 129, 780);
    			set_style(strong1, "color", "#2eb6e8");
    			add_location(strong1, file$d, 13, 205, 856);
    			add_location(p1, file$d, 12, 2, 646);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$d, 16, 49, 1064);
    			add_location(li0, file$d, 16, 4, 1019);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$d, 17, 81, 1304);
    			add_location(li1, file$d, 17, 4, 1227);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$d, 18, 14, 1430);
    			add_location(li2, file$d, 18, 4, 1420);
    			add_location(ol, file$d, 15, 2, 1009);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$d, 21, 60, 1642);
    			add_location(p2, file$d, 20, 2, 1577);
    			attr_dev(img, "width", "40%");
    			if (!src_url_equal(img.src, img_src_value = "/img/GraphToMatrix.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "A snapshot of the interface of the tool Graph to Matrix");
    			add_location(img, file$d, 23, 22, 1882);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$d, 23, 2, 1862);
    			attr_dev(div2, "class", "text");
    			add_location(div2, file$d, 8, 0, 104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(p0, strong0);
    			append_dev(p0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, p1);
    			append_dev(p1, t7);
    			append_dev(p1, span0);
    			append_dev(p1, t9);
    			append_dev(p1, strong1);
    			append_dev(p1, t11);
    			append_dev(div2, t12);
    			append_dev(div2, ol);
    			append_dev(ol, li0);
    			append_dev(li0, t13);
    			append_dev(li0, span1);
    			append_dev(li0, t15);
    			append_dev(ol, t16);
    			append_dev(ol, li1);
    			append_dev(li1, t17);
    			append_dev(li1, span2);
    			append_dev(li1, t19);
    			append_dev(ol, t20);
    			append_dev(ol, li2);
    			append_dev(li2, t21);
    			append_dev(li2, span3);
    			append_dev(li2, t23);
    			append_dev(div2, t24);
    			append_dev(div2, p2);
    			append_dev(p2, t25);
    			append_dev(p2, span4);
    			append_dev(p2, t27);
    			append_dev(div2, t28);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HowToDesign', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HowToDesign> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class HowToDesign extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HowToDesign",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var bar1 = {
        points: [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
            { x: 7, y: 0 },
            { x: 8, y: 0 },
        ],
        yTicks: [0, 2, 4, 6, 8, 10, 12, 14]
    };

    var bar2 = {
        points: [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0.24 },
            { x: 7, y: 0.66 },
            { x: 8, y: 3.41 },
        ],
        yTicks: [0, 2, 4, 6, 8, 10, 12, 14]
    };

    var bar3 = {
        points: [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
            { x: 7, y: 0 },
            { x: 8, y: 1 },
        ],
        yTicks: [0, 2, 4, 6, 8, 10, 12, 14]
    };

    var bar4 = {
        points: [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0.06 },
            { x: 6, y: 1.97 },
            { x: 7, y: 5.42 },
            { x: 8, y: 11.05 },
        ],
        yTicks: [0, 2, 4, 6, 8, 10, 12, 14]
    };

    var bar5 = {
        points: [
            { x: 3, y: 97.52 },
            { x: 4, y: 105.30 },
            { x: 5, y: 102.97 },
            { x: 6, y: 111.93 },
            { x: 7, y: 114.57 },
            { x: 8, y: 110.98 },
        ],
        yTicks: [0, 25, 50, 75, 100, 125, 150, 175, 200]
    };

    var bar6 = {
        points: [
            { x: 3, y: 102.80 },
            { x: 4, y: 106.66 },
            { x: 5, y: 105.05 },
            { x: 6, y: 114.20 },
            { x: 7, y: 119.58 },
            { x: 8, y: 121.22 },
        ],
        yTicks: [0, 25, 50, 75, 100, 125, 150, 175, 200]
    };

    var bar7 = {
        points: [
            { x: 3, y: 160.27 },
            { x: 4, y: 160.35 },
            { x: 5, y: 160.48 },
            { x: 6, y: 160.57 },
            { x: 7, y: 160.63 },
            { x: 8, y: 160.68 },
        ],
        yTicks: [0, 25, 50, 75, 100, 125, 150, 175, 200]
    };

    var bar8 = {
        points: [
            { x: 3, y: 160.28 },
            { x: 4, y: 160.39 },
            { x: 5, y: 160.51 },
            { x: 6, y: 160.63 },
            { x: 7, y: 160.68 },
            { x: 8, y: 160.74 },
        ],
        yTicks: [0, 25, 50, 75, 100, 125, 150, 175, 200]
    };

    var bar9 = {
        points: [
            { x: 3, y: 653990 },
            { x: 4, y: 649610 },
            { x: 5, y: 660120 },
            { x: 6, y: 669450 },
            { x: 7, y: 727680 },
            { x: 8, y: 716910 },
        ],
        yTicks: [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000]
    };

    var bar10 = {
        points: [
            { x: 3, y: 664510 },
            { x: 4, y: 620840 },
            { x: 5, y: 654790 },
            { x: 6, y: 714050 },
            { x: 7, y: 715580 },
            { x: 8, y: 694620 },
        ],
        yTicks: [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000]
    };

    /* src\components\lessons\ExperimentalResults.svelte generated by Svelte v3.46.4 */
    const file$c = "src\\components\\lessons\\ExperimentalResults.svelte";

    // (38:418) <Link target="https://docs.ocean.dwavesys.com/projects/system/en/stable/reference/generated/dwave.system.composites.EmbeddingComposite.sample.html#dwave.system.composites.EmbeddingComposite.sample" newPage={true}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Reference Documentation");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(38:418) <Link target=\\\"https://docs.ocean.dwavesys.com/projects/system/en/stable/reference/generated/dwave.system.composites.EmbeddingComposite.sample.html#dwave.system.composites.EmbeddingComposite.sample\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (41:910) <Link target="https://www.fourmilab.ch/documents/travelling/anneal/" newPage={true}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(41:910) <Link target=\\\"https://www.fourmilab.ch/documents/travelling/anneal/\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (167:108) <Link target="https://github.com/Totemi1324/TSPquantum" newPage={true}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("the project's GitHub repo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(167:108) <Link target=\\\"https://github.com/Totemi1324/TSPquantum\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    // (174:8) <Link target="https://en.wikipedia.org/wiki/Simulated_annealing" newPage={true}>
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("https://en.wikipedia.org/wiki/Simulated_annealing");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(174:8) <Link target=\\\"https://en.wikipedia.org/wiki/Simulated_annealing\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr0;
    	let t2;
    	let div14;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let div1;
    	let img;
    	let img_src_value;
    	let t7;
    	let p2;
    	let t10;
    	let p3;
    	let t11;
    	let i0;
    	let t13;
    	let i1;
    	let t15;
    	let span0;
    	let t16;
    	let sub;
    	let t18;
    	let i2;
    	let t20;
    	let t21_value = `$$\\min C_{n}\\left(q\\right)=-8n+0.5n=-7.5n$$` + "";
    	let t21;
    	let t22;
    	let p4;
    	let t23;
    	let span1;
    	let t25;
    	let span2;
    	let t27;
    	let link0;
    	let t28;
    	let span3;
    	let t30;
    	let span4;
    	let t32;
    	let strong0;
    	let t34;
    	let t35;
    	let p5;
    	let t36;
    	let i3;
    	let t38;
    	let i4;
    	let t40;
    	let i5;
    	let t42;
    	let sup;
    	let t44;
    	let link1;
    	let t45;
    	let t46;
    	let p6;
    	let t48;
    	let div2;
    	let t50;
    	let div3;
    	let barchart0;
    	let t51;
    	let barchart1;
    	let t52;
    	let div4;
    	let t54;
    	let div5;
    	let barchart2;
    	let t55;
    	let barchart3;
    	let t56;
    	let div6;
    	let t58;
    	let div7;
    	let barchart4;
    	let t59;
    	let barchart5;
    	let t60;
    	let p7;
    	let t62;
    	let div8;
    	let t64;
    	let div9;
    	let barchart6;
    	let t65;
    	let barchart7;
    	let t66;
    	let div10;
    	let t68;
    	let div11;
    	let barchart8;
    	let t69;
    	let barchart9;
    	let t70;
    	let div12;
    	let t72;
    	let div13;
    	let barchart10;
    	let t73;
    	let barchart11;
    	let t74;
    	let p8;
    	let t76;
    	let p9;
    	let t77;
    	let link2;
    	let t78;
    	let strong1;
    	let t80;
    	let t81;
    	let hr1;
    	let t82;
    	let div15;
    	let h3;
    	let t84;
    	let ol;
    	let li;
    	let link3;
    	let t85;
    	let current;

    	link0 = new Link({
    			props: {
    				target: "https://docs.ocean.dwavesys.com/projects/system/en/stable/reference/generated/dwave.system.composites.EmbeddingComposite.sample.html#dwave.system.composites.EmbeddingComposite.sample",
    				newPage: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				target: "https://www.fourmilab.ch/documents/travelling/anneal/",
    				newPage: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	barchart0 = new BarChart({
    			props: {
    				points: bar1.points,
    				yTicks: bar1.yTicks,
    				yLabel: "Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#2eb6e8"
    			},
    			$$inline: true
    		});

    	barchart1 = new BarChart({
    			props: {
    				points: bar2.points,
    				yTicks: bar2.yTicks,
    				yLabel: "Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#2eb6e8"
    			},
    			$$inline: true
    		});

    	barchart2 = new BarChart({
    			props: {
    				points: bar3.points,
    				yTicks: bar3.yTicks,
    				yLabel: "Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#1a91bc"
    			},
    			$$inline: true
    		});

    	barchart3 = new BarChart({
    			props: {
    				points: bar4.points,
    				yTicks: bar4.yTicks,
    				yLabel: "Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#1a91bc"
    			},
    			$$inline: true
    		});

    	barchart4 = new BarChart({
    			props: {
    				points: bar1.points,
    				yTicks: bar1.yTicks,
    				yLabel: "Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#f1b6e8"
    			},
    			$$inline: true
    		});

    	barchart5 = new BarChart({
    			props: {
    				points: bar1.points,
    				yTicks: bar1.yTicks,
    				yLabel: "Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#f1b6e8"
    			},
    			$$inline: true
    		});

    	barchart6 = new BarChart({
    			props: {
    				points: bar5.points,
    				yTicks: bar5.yTicks,
    				yLabel: "[ms] Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#2eb6e8"
    			},
    			$$inline: true
    		});

    	barchart7 = new BarChart({
    			props: {
    				points: bar6.points,
    				yTicks: bar6.yTicks,
    				yLabel: "[ms] Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#2eb6e8"
    			},
    			$$inline: true
    		});

    	barchart8 = new BarChart({
    			props: {
    				points: bar7.points,
    				yTicks: bar7.yTicks,
    				yLabel: "[ms] Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#1a91bc"
    			},
    			$$inline: true
    		});

    	barchart9 = new BarChart({
    			props: {
    				points: bar8.points,
    				yTicks: bar8.yTicks,
    				yLabel: "[ms] Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#1a91bc"
    			},
    			$$inline: true
    		});

    	barchart10 = new BarChart({
    			props: {
    				points: bar9.points,
    				yTicks: bar9.yTicks,
    				yLabel: "[ms] Simple problem",
    				width: "300",
    				height: "300",
    				barColor: "#f1b6e8"
    			},
    			$$inline: true
    		});

    	barchart11 = new BarChart({
    			props: {
    				points: bar10.points,
    				yTicks: bar10.yTicks,
    				yLabel: "[ms] Complex problem",
    				width: "300",
    				height: "300",
    				barColor: "#f1b6e8"
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				target: "https://github.com/Totemi1324/TSPquantum",
    				newPage: true,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				target: "https://en.wikipedia.org/wiki/Simulated_annealing",
    				newPage: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Experimental results";
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			div14 = element("div");
    			p0 = element("p");
    			p0.textContent = "When it comes to evaluating the performance of quantum algorithms, this often poses a problem because of the inherent non-deterministic nature of this method. Due to the work with quantum states, there is always a portion of randomness involved. In the following sections, we therefore explore how efficient solving the Traveling Salesman Problem on quantum computers really is and how we can improve on this performance.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "The first problem emerges when trying to quantify TSPs, the underlying mathematical problem. In order to be comparable, a uniform benchmark for graphs of arbitrary size is needed. One way to address this issue is to use graphs in the shape of regular polygons to test the quantum algorithm, starting with a triangle (since it is the simplest shape with a valid Hamiltonian cycle) up to an octagon:";
    			t6 = space();
    			div1 = element("div");
    			img = element("img");
    			t7 = space();
    			p2 = element("p");

    			p2.textContent = `Here, regular polygons with an edge length of 50 units each were used; the coordinates of the corner points can be calculated using e.g. a graphing calculator. These shapes are then converted to the respective Hamiltonian matrices, scaling the costs to 1% (0.5) and the coefficients to 8. For example, the triangle transforms into the following:
    ${`$$H=\\begin{bmatrix}-8.0 & 8.0 & 8.0 & 8.0 & 0.5 & 0.5 & 8.0 & 0.5 & 0.5 \\\\ 0.0 & -8.0 & 8.0 & 0.5 & 8.0 & 0.5 & 0.5 & 8.0 & 0.5 \\\\ 0.0 & 0.0 & -8.0 & 0.5 & 0.5 & 8.0 & 0.5 & 0.5 & 8.0 \\\\ 0.0 & 0.0 & 0.0 & -8.0 & 8.0 & 8.0 & 8.0 & 0.5 & 0.5 \\\\ 0.0 & 0.0 & 0.0 & 0.0 & -8.0 & 8.0 & 0.5 & 8.0 & 0.5 \\\\ 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & -8.0 & 0.5 & 0.5 & 8.0 \\\\ 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & -8.0 & 8.0 & 8.0 \\\\ 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & -8.0 & 8.0 \\\\ 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & 0.0 & -8.0\\end{bmatrix}$$`}`;

    			t10 = space();
    			p3 = element("p");
    			t11 = text("Using this structure, two problem sets were created: ");
    			i0 = element("i");
    			i0.textContent = "Simple problems";
    			t13 = text(" where the costs are emitted (so the annealer's only task is to find a valid tour) and ");
    			i1 = element("i");
    			i1.textContent = "complex problems";
    			t15 = text(" with the costs of the edges included. A major advantage of using polygons is that since the shortest path is always around the edges, the optimal cost can be easily calculated beforehand using this formula, given that ");
    			span0 = element("span");
    			t16 = text("C");
    			sub = element("sub");
    			sub.textContent = "n";
    			t18 = text(" is the cost function for a polygon with ");
    			i2 = element("i");
    			i2.textContent = "n";
    			t20 = text(" corners:\r\n    ");
    			t21 = text(t21_value);
    			t22 = space();
    			p4 = element("p");
    			t23 = text("Now, the test cases are ready to be fed to the quantum annealer. But before performing the actual benchmark, we have to tune the hyperparameters, i.e. the static parameters that impact the algorithm performance and do not get changed during the calculations. The ones most important to our problem are ");
    			span1 = element("span");
    			span1.textContent = "chain_strength";
    			t25 = text(" and ");
    			span2 = element("span");
    			span2.textContent = "annealing_time";
    			t27 = text(". According to the ");
    			create_component(link0.$$.fragment);
    			t28 = text(", ");
    			span3 = element("span");
    			span3.textContent = "chain_strength";
    			t30 = text(" represents the \"coupling strength between qubits that form a chain\" on the QPU, meaning the magnitude of the magnetic fields that function as couplers forcing qubits to assume identical values. Similarly, ");
    			span4 = element("span");
    			span4.textContent = "annealing_time";
    			t32 = text(" sets the time the qubits are allowed to anneal to their optimal energy state before reading them and causing the superposition to collapse. For each of these values, there exist prevailing rules of thumb, but they need not always be the best ones. The optimization process is lengthy and needs a lot of data; if you are interested in the detailed procedure and results, you can get them at the ");
    			strong0 = element("strong");
    			strong0.textContent = "Downloads";
    			t34 = text(" tab of this site.");
    			t35 = space();
    			p5 = element("p");
    			t36 = text("After the hyperparameters have been optimized, it's time to evaluate the overall effectiveness of the quantum solution method. To achieve this, every polygon size of both problem sets was evaluated by the state-of-the-art ");
    			i3 = element("i");
    			i3.textContent = "D-Wave Advantage";
    			t38 = text(" (Pegasus architecture, 5640 qubits) and the older ");
    			i4 = element("i");
    			i4.textContent = "D-Wave 200Q";
    			t40 = text(" (Chimera architecture, 2048 qubits) systems with 10 random generated embeddings each. As a comparison to traditional computing, the problems were also submitted to a ");
    			i5 = element("i");
    			i5.textContent = "Simulated Annealing";
    			t42 = text(" algorithm, which is a widely used heuristic approach to optimization problems that changes the parameters of a problem through random permutations and uses a cooling function to decide whether to keep or discard these");
    			sup = element("sup");
    			sup.textContent = "1";
    			t44 = text(". A full explanation would go beyond the scopes of this course, but if you want to learn more about the procedure in detail, you can read about its applications in TSPs ");
    			create_component(link1.$$.fragment);
    			t45 = text(".");
    			t46 = space();
    			p6 = element("p");
    			p6.textContent = "Finally, the following graphs present the results of the different approaches in comparison. Since we're not after relative performance comparisons over a spectrum of values like in the experiments before, we'll only keep the best solution yielded by the reads and calculate difference to the optimal solution instead of the success rate. First, let's look at the energy deltas, that is, the amount of energy by which the quantum annealer missed the optimal solution (therefore, lower values are better). The bars indicate the arithmetic mean of 10 experimental results:";
    			t48 = space();
    			div2 = element("div");
    			div2.textContent = "Advantage";
    			t50 = space();
    			div3 = element("div");
    			create_component(barchart0.$$.fragment);
    			t51 = space();
    			create_component(barchart1.$$.fragment);
    			t52 = space();
    			div4 = element("div");
    			div4.textContent = "2000Q";
    			t54 = space();
    			div5 = element("div");
    			create_component(barchart2.$$.fragment);
    			t55 = space();
    			create_component(barchart3.$$.fragment);
    			t56 = space();
    			div6 = element("div");
    			div6.textContent = "Simulated Annealing";
    			t58 = space();
    			div7 = element("div");
    			create_component(barchart4.$$.fragment);
    			t59 = space();
    			create_component(barchart5.$$.fragment);
    			t60 = space();
    			p7 = element("p");
    			p7.textContent = "Next, the times needed for solving:";
    			t62 = space();
    			div8 = element("div");
    			div8.textContent = "Advantage";
    			t64 = space();
    			div9 = element("div");
    			create_component(barchart6.$$.fragment);
    			t65 = space();
    			create_component(barchart7.$$.fragment);
    			t66 = space();
    			div10 = element("div");
    			div10.textContent = "2000Q";
    			t68 = space();
    			div11 = element("div");
    			create_component(barchart8.$$.fragment);
    			t69 = space();
    			create_component(barchart9.$$.fragment);
    			t70 = space();
    			div12 = element("div");
    			div12.textContent = "Simulated Annealing";
    			t72 = space();
    			div13 = element("div");
    			create_component(barchart10.$$.fragment);
    			t73 = space();
    			create_component(barchart11.$$.fragment);
    			t74 = space();
    			p8 = element("p");
    			p8.textContent = "This experiments immediately show the downside of Simulated Annealing, similar to other traditional computing methods: Whereas it is able to find optimal solutions for large problem sizes, the time needed for computation is very lengthy, more than 10 minutes in most cases. The quantum annealers on the other hand are able to solve the same tasks in just fragments of a second. The newer D-Wave Advantage model is faster than the 2000Q across all problem sizes, but the computing time varies more greatly and is less consistent. In summary, our quantum algorithm can find at least one correct solution for every problem size and complexity except for the n=8 complex problem.";
    			t76 = space();
    			p9 = element("p");
    			t77 = text("All Python files used to perform the experiments as well as the raw measurement data can be accessed at ");
    			create_component(link2.$$.fragment);
    			t78 = text(" and at the ");
    			strong1 = element("strong");
    			strong1.textContent = "Downloads";
    			t80 = text(" section.");
    			t81 = space();
    			hr1 = element("hr");
    			t82 = space();
    			div15 = element("div");
    			h3 = element("h3");
    			h3.textContent = "References";
    			t84 = space();
    			ol = element("ol");
    			li = element("li");
    			create_component(link3.$$.fragment);
    			t85 = text(", accessed: 12.05.2022");
    			attr_dev(h2, "class", "svelte-tvoj6g");
    			add_location(h2, file$c, 17, 2, 658);
    			attr_dev(div0, "class", "title svelte-tvoj6g");
    			add_location(div0, file$c, 16, 0, 635);
    			attr_dev(hr0, "class", "svelte-tvoj6g");
    			add_location(hr0, file$c, 19, 0, 697);
    			add_location(p0, file$c, 21, 2, 727);
    			add_location(p1, file$c, 24, 2, 1169);
    			attr_dev(img, "width", "700");
    			if (!src_url_equal(img.src, img_src_value = "/img/Benchmarks.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Different sized graphs for evaluating the TSP solver, ranging from a triangle to an octagon");
    			add_location(img, file$c, 27, 22, 1607);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$c, 27, 2, 1587);
    			add_location(p2, file$c, 28, 2, 1758);
    			add_location(i0, file$c, 33, 57, 2748);
    			add_location(i1, file$c, 33, 166, 2857);
    			add_location(sub, file$c, 33, 432, 3123);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$c, 33, 408, 3099);
    			add_location(i2, file$c, 33, 492, 3183);
    			add_location(p3, file$c, 32, 2, 2686);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$c, 37, 306, 3579);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$c, 37, 355, 3628);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$c, 37, 663, 3936);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$c, 37, 913, 4186);
    			set_style(strong0, "color", "#2eb6e8");
    			add_location(strong0, file$c, 37, 1352, 4625);
    			add_location(p4, file$c, 36, 2, 3268);
    			add_location(i3, file$c, 40, 226, 4936);
    			add_location(i4, file$c, 40, 300, 5010);
    			add_location(i5, file$c, 40, 485, 5195);
    			add_location(sup, file$c, 40, 729, 5439);
    			add_location(p5, file$c, 39, 2, 4705);
    			add_location(p6, file$c, 42, 2, 5728);
    			attr_dev(div2, "class", "subtitle svelte-tvoj6g");
    			add_location(div2, file$c, 45, 2, 6319);
    			attr_dev(div3, "class", "subplots svelte-tvoj6g");
    			add_location(div3, file$c, 46, 2, 6360);
    			attr_dev(div4, "class", "subtitle svelte-tvoj6g");
    			add_location(div4, file$c, 64, 2, 6747);
    			attr_dev(div5, "class", "subplots svelte-tvoj6g");
    			add_location(div5, file$c, 65, 2, 6784);
    			attr_dev(div6, "class", "subtitle svelte-tvoj6g");
    			add_location(div6, file$c, 83, 2, 7171);
    			attr_dev(div7, "class", "subplots svelte-tvoj6g");
    			add_location(div7, file$c, 84, 2, 7222);
    			add_location(p7, file$c, 102, 2, 7609);
    			attr_dev(div8, "class", "subtitle svelte-tvoj6g");
    			add_location(div8, file$c, 105, 2, 7665);
    			attr_dev(div9, "class", "subplots svelte-tvoj6g");
    			add_location(div9, file$c, 106, 2, 7706);
    			attr_dev(div10, "class", "subtitle svelte-tvoj6g");
    			add_location(div10, file$c, 124, 2, 8103);
    			attr_dev(div11, "class", "subplots svelte-tvoj6g");
    			add_location(div11, file$c, 125, 2, 8140);
    			attr_dev(div12, "class", "subtitle svelte-tvoj6g");
    			add_location(div12, file$c, 143, 2, 8537);
    			attr_dev(div13, "class", "subplots svelte-tvoj6g");
    			add_location(div13, file$c, 144, 2, 8588);
    			add_location(p8, file$c, 162, 2, 8987);
    			set_style(strong1, "color", "#2eb6e8");
    			add_location(strong1, file$c, 166, 223, 9911);
    			add_location(p9, file$c, 165, 2, 9683);
    			attr_dev(div14, "class", "text");
    			add_location(div14, file$c, 20, 0, 705);
    			attr_dev(hr1, "class", "svelte-tvoj6g");
    			add_location(hr1, file$c, 169, 0, 9988);
    			attr_dev(h3, "class", "svelte-tvoj6g");
    			add_location(h3, file$c, 171, 2, 10016);
    			add_location(li, file$c, 173, 4, 10049);
    			add_location(ol, file$c, 172, 2, 10039);
    			attr_dev(div15, "class", "refs svelte-tvoj6g");
    			add_location(div15, file$c, 170, 0, 9994);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, p0);
    			append_dev(div14, t4);
    			append_dev(div14, p1);
    			append_dev(div14, t6);
    			append_dev(div14, div1);
    			append_dev(div1, img);
    			append_dev(div14, t7);
    			append_dev(div14, p2);
    			append_dev(div14, t10);
    			append_dev(div14, p3);
    			append_dev(p3, t11);
    			append_dev(p3, i0);
    			append_dev(p3, t13);
    			append_dev(p3, i1);
    			append_dev(p3, t15);
    			append_dev(p3, span0);
    			append_dev(span0, t16);
    			append_dev(span0, sub);
    			append_dev(p3, t18);
    			append_dev(p3, i2);
    			append_dev(p3, t20);
    			append_dev(p3, t21);
    			append_dev(div14, t22);
    			append_dev(div14, p4);
    			append_dev(p4, t23);
    			append_dev(p4, span1);
    			append_dev(p4, t25);
    			append_dev(p4, span2);
    			append_dev(p4, t27);
    			mount_component(link0, p4, null);
    			append_dev(p4, t28);
    			append_dev(p4, span3);
    			append_dev(p4, t30);
    			append_dev(p4, span4);
    			append_dev(p4, t32);
    			append_dev(p4, strong0);
    			append_dev(p4, t34);
    			append_dev(div14, t35);
    			append_dev(div14, p5);
    			append_dev(p5, t36);
    			append_dev(p5, i3);
    			append_dev(p5, t38);
    			append_dev(p5, i4);
    			append_dev(p5, t40);
    			append_dev(p5, i5);
    			append_dev(p5, t42);
    			append_dev(p5, sup);
    			append_dev(p5, t44);
    			mount_component(link1, p5, null);
    			append_dev(p5, t45);
    			append_dev(div14, t46);
    			append_dev(div14, p6);
    			append_dev(div14, t48);
    			append_dev(div14, div2);
    			append_dev(div14, t50);
    			append_dev(div14, div3);
    			mount_component(barchart0, div3, null);
    			append_dev(div3, t51);
    			mount_component(barchart1, div3, null);
    			append_dev(div14, t52);
    			append_dev(div14, div4);
    			append_dev(div14, t54);
    			append_dev(div14, div5);
    			mount_component(barchart2, div5, null);
    			append_dev(div5, t55);
    			mount_component(barchart3, div5, null);
    			append_dev(div14, t56);
    			append_dev(div14, div6);
    			append_dev(div14, t58);
    			append_dev(div14, div7);
    			mount_component(barchart4, div7, null);
    			append_dev(div7, t59);
    			mount_component(barchart5, div7, null);
    			append_dev(div14, t60);
    			append_dev(div14, p7);
    			append_dev(div14, t62);
    			append_dev(div14, div8);
    			append_dev(div14, t64);
    			append_dev(div14, div9);
    			mount_component(barchart6, div9, null);
    			append_dev(div9, t65);
    			mount_component(barchart7, div9, null);
    			append_dev(div14, t66);
    			append_dev(div14, div10);
    			append_dev(div14, t68);
    			append_dev(div14, div11);
    			mount_component(barchart8, div11, null);
    			append_dev(div11, t69);
    			mount_component(barchart9, div11, null);
    			append_dev(div14, t70);
    			append_dev(div14, div12);
    			append_dev(div14, t72);
    			append_dev(div14, div13);
    			mount_component(barchart10, div13, null);
    			append_dev(div13, t73);
    			mount_component(barchart11, div13, null);
    			append_dev(div14, t74);
    			append_dev(div14, p8);
    			append_dev(div14, t76);
    			append_dev(div14, p9);
    			append_dev(p9, t77);
    			mount_component(link2, p9, null);
    			append_dev(p9, t78);
    			append_dev(p9, strong1);
    			append_dev(p9, t80);
    			insert_dev(target, t81, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, h3);
    			append_dev(div15, t84);
    			append_dev(div15, ol);
    			append_dev(ol, li);
    			mount_component(link3, li, null);
    			append_dev(li, t85);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(barchart0.$$.fragment, local);
    			transition_in(barchart1.$$.fragment, local);
    			transition_in(barchart2.$$.fragment, local);
    			transition_in(barchart3.$$.fragment, local);
    			transition_in(barchart4.$$.fragment, local);
    			transition_in(barchart5.$$.fragment, local);
    			transition_in(barchart6.$$.fragment, local);
    			transition_in(barchart7.$$.fragment, local);
    			transition_in(barchart8.$$.fragment, local);
    			transition_in(barchart9.$$.fragment, local);
    			transition_in(barchart10.$$.fragment, local);
    			transition_in(barchart11.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(barchart0.$$.fragment, local);
    			transition_out(barchart1.$$.fragment, local);
    			transition_out(barchart2.$$.fragment, local);
    			transition_out(barchart3.$$.fragment, local);
    			transition_out(barchart4.$$.fragment, local);
    			transition_out(barchart5.$$.fragment, local);
    			transition_out(barchart6.$$.fragment, local);
    			transition_out(barchart7.$$.fragment, local);
    			transition_out(barchart8.$$.fragment, local);
    			transition_out(barchart9.$$.fragment, local);
    			transition_out(barchart10.$$.fragment, local);
    			transition_out(barchart11.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div14);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(barchart0);
    			destroy_component(barchart1);
    			destroy_component(barchart2);
    			destroy_component(barchart3);
    			destroy_component(barchart4);
    			destroy_component(barchart5);
    			destroy_component(barchart6);
    			destroy_component(barchart7);
    			destroy_component(barchart8);
    			destroy_component(barchart9);
    			destroy_component(barchart10);
    			destroy_component(barchart11);
    			destroy_component(link2);
    			if (detaching) detach_dev(t81);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(div15);
    			destroy_component(link3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperimentalResults', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperimentalResults> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		BarChart,
    		Link,
    		bar1,
    		bar2,
    		bar3,
    		bar4,
    		bar5,
    		bar6,
    		bar7,
    		bar8,
    		bar9,
    		bar10
    	});

    	return [];
    }

    class ExperimentalResults extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperimentalResults",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\lessons\Constraints.svelte generated by Svelte v3.46.4 */
    const file$b = "src\\components\\lessons\\Constraints.svelte";

    // (23:525) <Link target="https://docs.ocean.dwavesys.com/en/stable/concepts/embedding.html" newPage={true}>
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("official documentation");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(23:525) <Link target=\\\"https://docs.ocean.dwavesys.com/en/stable/concepts/embedding.html\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div2;
    	let p0;
    	let t3;
    	let i0;
    	let t5;
    	let i1;
    	let t6;
    	let sup0;
    	let t8;
    	let i2;
    	let t9;
    	let sup1;
    	let t11;
    	let sup2;
    	let t13;
    	let i3;
    	let t15;
    	let t16_value = `$$O\\left(n\\right)\\approx n^4$$` + "";
    	let t16;
    	let t17;
    	let div1;
    	let img;
    	let img_src_value;
    	let t18;
    	let p1;
    	let t19;
    	let span0;
    	let t21;
    	let span1;
    	let t23;
    	let t24;
    	let p2;
    	let t25;
    	let i4;
    	let t27;
    	let t28;
    	let h3;
    	let t30;
    	let p3;
    	let t31;
    	let link;
    	let t32;
    	let t33;
    	let p4;
    	let current;

    	link = new Link({
    			props: {
    				target: "https://docs.ocean.dwavesys.com/en/stable/concepts/embedding.html",
    				newPage: true,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Where are the constraints?";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text("Although the unbeatable speed of this quantum approach makes it very attractive, it also has some major limitations. Some of them are posed by the simple state of today's technology and are likely to be overcome by future advancements in the field of quantum computing. Since a graph of ");
    			i0 = element("i");
    			i0.textContent = "n";
    			t5 = text(" nodes is first converted to a Tour Matrix of ");
    			i1 = element("i");
    			t6 = text("n");
    			sup0 = element("sup");
    			sup0.textContent = "2";
    			t8 = text(" elements and then to a Hamiltonian of ");
    			i2 = element("i");
    			t9 = text("(n");
    			sup1 = element("sup");
    			sup1.textContent = "2";
    			t11 = text(")");
    			sup2 = element("sup");
    			sup2.textContent = "2";
    			t13 = text(" elements, the number of qubits and connections needed rises quartically, i.e. by an exponent of four. Analogous to traditional computing, you could characterize the ");
    			i3 = element("i");
    			i3.textContent = "complexity";
    			t15 = text(" of the quantum algorithm as:\r\n    ");
    			t16 = text(t16_value);
    			t17 = space();
    			div1 = element("div");
    			img = element("img");
    			t18 = space();
    			p1 = element("p");
    			t19 = text("As the number of interconnected qubits rises, the number of physical qubits that need to be combined to logical qubits increases, causing the probability of false results to grow exponentially. This is why ");
    			span0 = element("span");
    			span0.textContent = "n = 8";
    			t21 = text(" is approximately the limit of what the current D-Wave Advantage system can solve, as each qubit is connected to 15 others only. With each city added, the embedding also becomes larger, until eventually all the space on the QPU is used up. The figure on the right shows the space the embedding of the problem size ");
    			span1 = element("span");
    			span1.textContent = "n = 8";
    			t23 = text(" takes up on the QPU, working with chains that span 8-9 qubits in length. However, due to increasing computing capacity and more complex architectures, this limitation will likely become increasingly irrelevant in the future.");
    			t24 = space();
    			p2 = element("p");
    			t25 = text("The ");
    			i4 = element("i");
    			i4.textContent = "matrix density";
    			t27 = text(", meaning the proportion of matrix elements that are not zeros, also plays a role in computing efficiency. The sparser the Hamiltonian, i.e. the fewer chains are needed relative to the problem size, the easier it is for the quantum computer to solve the QUBO problem. Since the matrices produced by this quantum TSP algorithm are relatively dense, the performance limit is reached with smaller problem sizes than usual. This problem is far more relevant since it is not yet foreseeable whether the accuracy problems of quantum annealers will be solved by scaling alone.");
    			t28 = space();
    			h3 = element("h3");
    			h3.textContent = "A solution approach: Controlling the embedding";
    			t30 = space();
    			p3 = element("p");
    			t31 = text("When submitting problems to the QPU, the embedding is generated automatically by D-Wave Ocean to save time, especially in the case of larger problems. However, this is a complex optimization task as well which is why algorithms are likely to not find the best solution. If we wanted to maximize the efficiency, it therefore would be theoretically possible to manually embed the QUBO problem and to set each qubit and connection by hand. If you are interested in the technical side, you can read about it in detail in the ");
    			create_component(link.$$.fragment);
    			t32 = text(".");
    			t33 = space();
    			p4 = element("p");
    			p4.textContent = "This task however requires not only a large amount of further mathematical calculations, but also an intricate and founded knowledge of the QPU topology. The process is time-consuming and has to be repeated for each individual problem size, making it only worthwhile for some small problems.";
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$b, 5, 2, 94);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$b, 4, 0, 71);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$b, 7, 0, 139);
    			add_location(i0, file$b, 10, 291, 465);
    			add_location(sup0, file$b, 10, 349, 523);
    			add_location(i1, file$b, 10, 345, 519);
    			add_location(sup1, file$b, 10, 409, 583);
    			add_location(sup2, file$b, 10, 422, 596);
    			add_location(i2, file$b, 10, 404, 578);
    			add_location(i3, file$b, 10, 604, 778);
    			add_location(p0, file$b, 9, 2, 169);
    			attr_dev(img, "width", "300");
    			if (!src_url_equal(img.src, img_src_value = "/img/Inspector.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "A visualization of the network of qubits on the QPU that are involved in the calculation of a TSP of size 8");
    			add_location(img, file$b, 13, 44, 921);
    			set_style(div1, "float", "right");
    			set_style(div1, "margin", "0 20px");
    			add_location(div1, file$b, 13, 2, 879);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$b, 15, 210, 1302);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$b, 15, 559, 1651);
    			add_location(p1, file$b, 14, 2, 1087);
    			add_location(i4, file$b, 18, 8, 1936);
    			add_location(p2, file$b, 17, 2, 1923);
    			add_location(h3, file$b, 20, 2, 2538);
    			add_location(p3, file$b, 21, 2, 2597);
    			add_location(p4, file$b, 24, 2, 3265);
    			attr_dev(div2, "class", "text");
    			add_location(div2, file$b, 8, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(p0, i0);
    			append_dev(p0, t5);
    			append_dev(p0, i1);
    			append_dev(i1, t6);
    			append_dev(i1, sup0);
    			append_dev(p0, t8);
    			append_dev(p0, i2);
    			append_dev(i2, t9);
    			append_dev(i2, sup1);
    			append_dev(i2, t11);
    			append_dev(i2, sup2);
    			append_dev(p0, t13);
    			append_dev(p0, i3);
    			append_dev(p0, t15);
    			append_dev(p0, t16);
    			append_dev(div2, t17);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div2, t18);
    			append_dev(div2, p1);
    			append_dev(p1, t19);
    			append_dev(p1, span0);
    			append_dev(p1, t21);
    			append_dev(p1, span1);
    			append_dev(p1, t23);
    			append_dev(div2, t24);
    			append_dev(div2, p2);
    			append_dev(p2, t25);
    			append_dev(p2, i4);
    			append_dev(p2, t27);
    			append_dev(div2, t28);
    			append_dev(div2, h3);
    			append_dev(div2, t30);
    			append_dev(div2, p3);
    			append_dev(p3, t31);
    			mount_component(link, p3, null);
    			append_dev(p3, t32);
    			append_dev(div2, t33);
    			append_dev(div2, p4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Constraints', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Constraints> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Constraints extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Constraints",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\lessons\Improvements.svelte generated by Svelte v3.46.4 */
    const file$a = "src\\components\\lessons\\Improvements.svelte";

    function create_fragment$a(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div4;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let span0;
    	let t7;
    	let t8;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let p2;
    	let t10;
    	let span1;
    	let t12;
    	let span2;
    	let t14;
    	let span3;
    	let t16;
    	let span4;
    	let t18;
    	let t19;
    	let p3;
    	let t20;
    	let i0;
    	let t22;
    	let i1;
    	let t24;
    	let t25;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let br;
    	let i2;
    	let t27;
    	let p4;
    	let t30;
    	let p5;
    	let t32;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t33;
    	let p6;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Possible improvements and optimizations";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "The presentation and evaluation of the method is completed; however, it should be considered more as a basis for further algorithmic approaches of this kind and can be further optimized and extended with a few adjustments.";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Since TSP solutions are closed loops that visit every city, the starting point can be set arbitrarily. So in theory, if we take this decision away from the quantum annealer and set the starting point to, say, ");
    			span0 = element("span");
    			span0.textContent = "A";
    			t7 = text(", the first row and column of the Tour matrix can be omitted, since this city is guaranteed not to be visited in the rest of the path:");
    			t8 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t9 = space();
    			p2 = element("p");
    			t10 = text("In addition, the cost function needs to be adjusted so the path from ");
    			span1 = element("span");
    			span1.textContent = "A";
    			t12 = text(" to ");
    			span2 = element("span");
    			span2.textContent = "B";
    			t14 = text(", ");
    			span3 = element("span");
    			span3.textContent = "A";
    			t16 = text(" to ");
    			span4 = element("span");
    			span4.textContent = "C";
    			t18 = text(" etc. is only dependent on the second node visited. This approach reduces the size of the Tour Matrix by 1, meaning the number of cities the annealer can find a solution for can be increased by 1 beyond its normal computing capability. However, these and other optimizations are only worthwhile in the long term if they can actually reduce the number of non-zero entries in the Hamiltonian.");
    			t19 = space();
    			p3 = element("p");
    			t20 = text("To make the algorithm more applicable for real-life situations, it would also be possible to extend it beyond the scope of the traditional Traveling Salesman Problem for ");
    			i0 = element("i");
    			i0.textContent = "incomplete graphs";
    			t22 = text(" (where not all nodes are interconnected) and ");
    			i1 = element("i");
    			i1.textContent = "directed graphs";
    			t24 = text(" (where certain edges can only be traversed in one direction or have different costs depending on the traversing direction):");
    			t25 = space();
    			div2 = element("div");
    			img1 = element("img");
    			br = element("br");
    			i2 = element("i");
    			i2.textContent = "Examples of an incomplete graph (left) and a directed graph (right)";
    			t27 = space();
    			p4 = element("p");

    			p4.textContent = `If a connection between a pair of cities doesn't exists (for example because of a road network layout), the quantum annealer has to be discouraged at all costs from incorporating it in the solution. To represent a non-existent edge, you therefore could assign a massive punishment to it so that the lowest cost is never reached if it's part of the tour. In mathematical literature, this is commonly expressed with an "∞" (infinity) symbol, but in our case, a high integer number is more applicable.
    ${`$$H=\\begin{bmatrix}-2 & 2 & 2 & 2 & 2 & \\infty & 0 & \\infty & \\cdots & 4 \\\\ 0 & -2 & 2 & 2 & \\infty & 2 & \\infty & 0 & \\cdots & 0 \\\\ 0 & 0 & -2 & 2 & 0 & \\infty & 2 & \\infty & \\cdots & 4 \\\\ 0 & 0 & 0 & -2 & \\infty & 0 & \\infty & 2 & \\cdots & 2 \\\\ 0 & 0 & 0 & 0 & -2 & 2 & 2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & -2 & 2 & 2 & \\cdots & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & -2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & -2 & \\cdots & 2 \\\\ \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & \\cdots & -2\\end{bmatrix}\\Rightarrow\\begin{bmatrix}-2 & 2 & 2 & 2 & 2 & 100 & 0 & 100 & \\cdots & 4 \\\\ 0 & -2 & 2 & 2 & 100 & 2 & 100 & 0 & \\cdots & 0 \\\\ 0 & 0 & -2 & 2 & 0 & 100 & 2 & 100 & \\cdots & 4 \\\\ 0 & 0 & 0 & -2 & 100 & 0 & 100 & 2 & \\cdots & 2 \\\\ 0 & 0 & 0 & 0 & -2 & 2 & 2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & -2 & 2 & 2 & \\cdots & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & -2 & 2 & \\cdots & 3.6 \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & -2 & \\cdots & 2 \\\\ \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & \\cdots & -2\\end{bmatrix}$$`}`;

    			t30 = space();
    			p5 = element("p");
    			p5.textContent = "To represent different costs at different traversing directions in a directed graph, you only have to differentiate between the order the nodes can be visited when formulating the QUBO equation. In the example below, the cost function has different values depending on whether the path leads from A to C or from C to A:";
    			t32 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t33 = space();
    			p6 = element("p");

    			p6.textContent = `${`$$\\Rightarrow f\\left(a,b,...,i,j\\right)=...+3aj+5ib+...$$`}
    The previous method can be applied to the case when a connection exists only in one direction: The other direction is assigned a high cost. It should be noted, however, that in the case of incomplete and directed graphs, the quantum annealer can only output a valid solution if a Hamiltonian cycle actually exists.`;

    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$a, 5, 2, 94);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$a, 4, 0, 71);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$a, 7, 0, 152);
    			add_location(p0, file$a, 9, 2, 182);
    			attr_dev(span0, "class", "emphasis");
    			add_location(span0, file$a, 13, 213, 643);
    			add_location(p1, file$a, 12, 2, 425);
    			attr_dev(img0, "width", "250");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/MatrixOptimal.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$a, 15, 22, 840);
    			attr_dev(div1, "align", "center");
    			add_location(div1, file$a, 15, 2, 820);
    			attr_dev(span1, "class", "emphasis");
    			add_location(span1, file$a, 17, 73, 981);
    			attr_dev(span2, "class", "emphasis");
    			add_location(span2, file$a, 17, 108, 1016);
    			attr_dev(span3, "class", "emphasis");
    			add_location(span3, file$a, 17, 141, 1049);
    			attr_dev(span4, "class", "emphasis");
    			add_location(span4, file$a, 17, 176, 1084);
    			add_location(p2, file$a, 16, 2, 903);
    			add_location(i0, file$a, 20, 174, 1696);
    			add_location(i1, file$a, 20, 244, 1766);
    			add_location(p3, file$a, 19, 2, 1517);
    			attr_dev(img1, "width", "600");
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Graphs.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$a, 22, 22, 1944);
    			add_location(br, file$a, 22, 68, 1990);
    			add_location(i2, file$a, 22, 72, 1994);
    			attr_dev(div2, "align", "center");
    			add_location(div2, file$a, 22, 2, 1924);
    			add_location(p4, file$a, 23, 2, 2078);
    			add_location(p5, file$a, 27, 2, 3857);
    			attr_dev(img2, "width", "200");
    			if (!src_url_equal(img2.src, img2_src_value = "/img/MatrixDirected.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Excerpt of a Tour Matrix where arrows indicate the connections from node A to C and from node C to A");
    			add_location(img2, file$a, 30, 22, 4217);
    			attr_dev(div3, "align", "center");
    			add_location(div3, file$a, 30, 2, 4197);
    			add_location(p6, file$a, 31, 2, 4381);
    			attr_dev(div4, "class", "text");
    			add_location(div4, file$a, 8, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, p0);
    			append_dev(div4, t4);
    			append_dev(div4, p1);
    			append_dev(p1, t5);
    			append_dev(p1, span0);
    			append_dev(p1, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div4, t9);
    			append_dev(div4, p2);
    			append_dev(p2, t10);
    			append_dev(p2, span1);
    			append_dev(p2, t12);
    			append_dev(p2, span2);
    			append_dev(p2, t14);
    			append_dev(p2, span3);
    			append_dev(p2, t16);
    			append_dev(p2, span4);
    			append_dev(p2, t18);
    			append_dev(div4, t19);
    			append_dev(div4, p3);
    			append_dev(p3, t20);
    			append_dev(p3, i0);
    			append_dev(p3, t22);
    			append_dev(p3, i1);
    			append_dev(p3, t24);
    			append_dev(div4, t25);
    			append_dev(div4, div2);
    			append_dev(div2, img1);
    			append_dev(div2, br);
    			append_dev(div2, i2);
    			append_dev(div4, t27);
    			append_dev(div4, p4);
    			append_dev(div4, t30);
    			append_dev(div4, p5);
    			append_dev(div4, t32);
    			append_dev(div4, div3);
    			append_dev(div3, img2);
    			append_dev(div4, t33);
    			append_dev(div4, p6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Improvements', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Improvements> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Improvements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Improvements",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\lessons\ClosingThoughts.svelte generated by Svelte v3.46.4 */
    const file$9 = "src\\components\\lessons\\ClosingThoughts.svelte";

    // (18:91) <Link target="https://www.dwavesys.com/">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("D-Wave Systems Inc.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(18:91) <Link target=\\\"https://www.dwavesys.com/\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:167) <Link target="https://www.fz-juelich.de/de/ias/jsc">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Jülich Supercomputing Centre");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(18:167) <Link target=\\\"https://www.fz-juelich.de/de/ias/jsc\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div0;
    	let h2;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let h3;
    	let t8;
    	let p2;
    	let t9;
    	let link0;
    	let t10;
    	let link1;
    	let t11;
    	let t12;
    	let p3;
    	let t13;
    	let strong0;
    	let t15;
    	let strong1;
    	let t17;
    	let t18;
    	let p4;
    	let t19;
    	let strong2;
    	let t21;
    	let current;

    	link0 = new Link({
    			props: {
    				target: "https://www.dwavesys.com/",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				target: "https://www.fz-juelich.de/de/ias/jsc",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Closing thoughts";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "With new milestones being achieved every year, quantum computing is a rapidly evolving technology that will have a major impact on our lives. It is currently our most promising solution to the problem of optimization as a whole, which is why further research on quantum algorithms for the Traveling Salesman Problem and other tasks is definitely worthwhile.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Nevertheless, it is important to recognize the limitations as well. Until this method can be applied to problems relevant to everyday life and business (∼50-100 cities), much progress needs to be made. However, contrary to its (yet) limited capacity and its error rate, the quantum approach has a major potential to be used in real life, since in industry, in most cases, not necessarily the best but a good solution is needed and the speed with which it is found is much more important than its accuracy. Solving the TSP with quantum annealers therefore represents a great opportunity that can significantly accelerate manufacturing, logistics and research processes in the future.";
    			t6 = space();
    			h3 = element("h3");
    			h3.textContent = "Thank you notes";
    			t8 = space();
    			p2 = element("p");
    			t9 = text("I would like to sincerely thank everyone who supported me in this research, especially ");
    			create_component(link0.$$.fragment);
    			t10 = text(" and the ");
    			create_component(link1.$$.fragment);
    			t11 = text(".");
    			t12 = space();
    			p3 = element("p");
    			t13 = text("Special thanks go to ");
    			strong0 = element("strong");
    			strong0.textContent = "Dennis Willsch";
    			t15 = text(" and ");
    			strong1 = element("strong");
    			strong1.textContent = "Kristen Michielsen";
    			t17 = text(" at the JSC for their generous support, guidance and coordination.");
    			t18 = space();
    			p4 = element("p");
    			t19 = text("Thanks also to ");
    			strong2 = element("strong");
    			strong2.textContent = "René Grünbauer";
    			t21 = text(" from Gymnasium der Regensburger Domspatzen, who made the project possible through his excellent ideas.");
    			attr_dev(h2, "class", "svelte-vwpkwz");
    			add_location(h2, file$9, 5, 2, 94);
    			attr_dev(div0, "class", "title svelte-vwpkwz");
    			add_location(div0, file$9, 4, 0, 71);
    			attr_dev(hr, "class", "svelte-vwpkwz");
    			add_location(hr, file$9, 7, 0, 129);
    			add_location(p0, file$9, 9, 2, 159);
    			add_location(p1, file$9, 12, 2, 537);
    			add_location(h3, file$9, 15, 2, 1246);
    			add_location(p2, file$9, 16, 2, 1274);
    			add_location(strong0, file$9, 20, 25, 1576);
    			add_location(strong1, file$9, 20, 61, 1612);
    			add_location(p3, file$9, 19, 2, 1546);
    			add_location(strong2, file$9, 23, 19, 1749);
    			add_location(p4, file$9, 22, 2, 1725);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$9, 8, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, h3);
    			append_dev(div1, t8);
    			append_dev(div1, p2);
    			append_dev(p2, t9);
    			mount_component(link0, p2, null);
    			append_dev(p2, t10);
    			mount_component(link1, p2, null);
    			append_dev(p2, t11);
    			append_dev(div1, t12);
    			append_dev(div1, p3);
    			append_dev(p3, t13);
    			append_dev(p3, strong0);
    			append_dev(p3, t15);
    			append_dev(p3, strong1);
    			append_dev(p3, t17);
    			append_dev(div1, t18);
    			append_dev(div1, p4);
    			append_dev(p4, t19);
    			append_dev(p4, strong2);
    			append_dev(p4, t21);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClosingThoughts', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClosingThoughts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class ClosingThoughts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClosingThoughts",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const LessonStore = writable([
      {
        id: "BxESn",
        img: "/img/thumbnails/chapter1-BxESn.png",
        title: "An introduction to the Traveling Salesman Problem",
        desc: "You are the representative of a big company that sends you on a business trip through its main sites. Coincidentally, they are located in the ...",
        component: TSPIntroduction
      },
      {
        id: "m2MJl",
        img: "/img/thumbnails/chapter2-m2MJl.png",
        title: "QUBO-Problems",
        desc: "Before we can explore how quantum annealers work, there is an essential basic to be covered. For a quantum annealer to solve a task, it must be defined as ...",
        component: QUBOIntroduction
      },
      {
        id: "xR66u",
        img: "/img/thumbnails/chapter2-xR66u.png",
        title: "How do quantum annealers work?",
        desc: "Equipped with the basic mathematics, we can now face the question: How do we get from an input to a result? The process of programming a quantum annealer ...",
        component: QuantumAnnealers
      },
      {
        id: "yV8O6",
        img: "/img/thumbnails/chapter3-yV8O6.png",
        title: "Transforming the Traveling Salesman Problem for quantum annealers",
        desc: "Creating a quantum solution for the TSP is an exciting example of the versatility of quantum computing as well as a demonstration of ...",
        component: TSPQuantum
      },
      {
        id: "0nRrT",
        img: "/img/thumbnails/chapter3-0nRrT.png",
        title: "Formulating the QUBO equation",
        desc: "From the example tour matrix in the previous lesson, the following rules for occupancy can be derived: 1. Exactly one occupation per row is allowed (since ...",
        component: QUBOFormulating
      },
      {
        id: "EFTOp",
        img: "/img/thumbnails/chapter3-EFTOp.png",
        title: "From coefficients to the Hamiltonian",
        desc: "The coefficients from the QUBO equation need to be transferred to the Hamiltonian in order to be a valid input for the quantum annealer. The result of ...",
        component: CoefficientsToMatrix
      },
      {
        id: "m9UPL",
        img: "/img/thumbnails/chapter3-m9UPL.png",
        title: "How to design your own graphs",
        desc: "If you want to submit your own networks to the quantum annealer, you need to convert them to the Hamiltonian first. The tool Graph to Matrix, which can be ...",
        component: HowToDesign
      },
      {
        id: "okhMZ",
        img: "/img/thumbnails/chapter4-okhMZ.png",
        title: "Experimental results",
        desc: "When it comes to evaluating the performance of quantum algorithms, this often poses a problem because of the inherent non-deterministic nature of this method ...",
        component: ExperimentalResults
      },
      {
        id: "_Z9Gv",
        img: "/img/thumbnails/chapter4-_Z9Gv.png",
        title: "Where are the constraints?",
        desc: "This task however requires not only a large amount of further mathematical calculations, but also an intricate and founded knowledge of the QPU ...",
        component: Constraints
      },
      {
        id: "ufr4r",
        img: "/img/thumbnails/chapter4-ufr4r.png",
        title: "Possible improvements and optimizations",
        desc: "Since TSP solutions are closed loops that visit every city, the starting point can be set arbitrarily. So in theory, if we take this decision away from ...",
        component: Improvements
      },
      {
        id: "U7uiF",
        img: "",
        title: "Closing thoughts",
        desc: "With new milestones being achieved every year, quantum computing is a rapidly evolving technology that will have a major impact on our lives. It is currently ...",
        component: ClosingThoughts
      },
      {
        id: "eLyUg",
        img: "",
        title: "[TEMP] Demo card",
        desc: "This is a temporary card for testing features.",
        component: Demo
      },
      {
        id: "Z30Ce",
        img: "/img/thumbnails/chapter1-Z30Ce.png",
        title: "Graph theory",
        desc: "Computers only take numbers, so we need to use them as well. We already subconsciously drew a key concept of the solving method with the cities interconnected with...",
        component: GraphTheory
      }
    ]);

    /* node_modules\saos\src\Saos.svelte generated by Svelte v3.46.4 */
    const file$8 = "node_modules\\saos\\src\\Saos.svelte";

    // (75:2) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "style", div_style_value = "animation: " + /*animation_out*/ ctx[1] + "; " + /*css_animation*/ ctx[3]);
    			add_location(div, file$8, 75, 4, 2229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*animation_out, css_animation*/ 10 && div_style_value !== (div_style_value = "animation: " + /*animation_out*/ ctx[1] + "; " + /*css_animation*/ ctx[3])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(75:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if observing}
    function create_if_block$5(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "style", div_style_value = "animation: " + /*animation*/ ctx[0] + "; " + /*css_animation*/ ctx[3]);
    			add_location(div, file$8, 71, 4, 2135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*animation, css_animation*/ 9 && div_style_value !== (div_style_value = "animation: " + /*animation*/ ctx[0] + "; " + /*css_animation*/ ctx[3])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(71:2) {#if observing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*observing*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "id", /*countainer*/ ctx[5]);
    			attr_dev(div, "style", /*css_observer*/ ctx[2]);
    			add_location(div, file$8, 69, 0, 2070);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*css_observer*/ 4) {
    				attr_dev(div, "style", /*css_observer*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Saos', slots, ['default']);
    	let { animation = "none" } = $$props;
    	let { animation_out = "none; opacity: 0" } = $$props;
    	let { once = false } = $$props;
    	let { top = 0 } = $$props;
    	let { bottom = 0 } = $$props;
    	let { css_observer = "" } = $$props;
    	let { css_animation = "" } = $$props;

    	// cute litle reactive dispatch to get if is observing :3
    	const dispatch = createEventDispatcher();

    	// be aware... he's looking...
    	let observing = true;

    	// for some reason the 'bind:this={box}' on div stops working after npm run build... so... workaround time >:|
    	const countainer = `__saos-${Math.random()}__`;

    	/// current in experimental support, no support for IE (only Edge)
    	/// see more in: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
    	function intersection_verify(box) {
    		// bottom left top right
    		const rootMargin = `${-bottom}px 0px ${-top}px 0px`;

    		const observer = new IntersectionObserver(entries => {
    				$$invalidate(4, observing = entries[0].isIntersecting);

    				if (observing && once) {
    					observer.unobserve(box);
    				}
    			},
    		{ rootMargin });

    		observer.observe(box);
    		return () => observer.unobserve(box);
    	}

    	/// Fallback in case the browser not have the IntersectionObserver
    	function bounding_verify(box) {
    		const c = box.getBoundingClientRect();
    		$$invalidate(4, observing = c.top + top < window.innerHeight && c.bottom - bottom > 0);

    		if (observing && once) {
    			window.removeEventListener("scroll", verify);
    		}

    		window.addEventListener("scroll", bounding_verify);
    		return () => window.removeEventListener("scroll", bounding_verify);
    	}

    	onMount(() => {
    		// for some reason the 'bind:this={box}' on div stops working after npm run build... so... workaround time >:|
    		const box = document.getElementById(countainer);

    		if (IntersectionObserver) {
    			return intersection_verify(box);
    		} else {
    			return bounding_verify(box);
    		}
    	});

    	const writable_props = [
    		'animation',
    		'animation_out',
    		'once',
    		'top',
    		'bottom',
    		'css_observer',
    		'css_animation'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Saos> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('animation' in $$props) $$invalidate(0, animation = $$props.animation);
    		if ('animation_out' in $$props) $$invalidate(1, animation_out = $$props.animation_out);
    		if ('once' in $$props) $$invalidate(6, once = $$props.once);
    		if ('top' in $$props) $$invalidate(7, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(8, bottom = $$props.bottom);
    		if ('css_observer' in $$props) $$invalidate(2, css_observer = $$props.css_observer);
    		if ('css_animation' in $$props) $$invalidate(3, css_animation = $$props.css_animation);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		animation,
    		animation_out,
    		once,
    		top,
    		bottom,
    		css_observer,
    		css_animation,
    		dispatch,
    		observing,
    		countainer,
    		intersection_verify,
    		bounding_verify
    	});

    	$$self.$inject_state = $$props => {
    		if ('animation' in $$props) $$invalidate(0, animation = $$props.animation);
    		if ('animation_out' in $$props) $$invalidate(1, animation_out = $$props.animation_out);
    		if ('once' in $$props) $$invalidate(6, once = $$props.once);
    		if ('top' in $$props) $$invalidate(7, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(8, bottom = $$props.bottom);
    		if ('css_observer' in $$props) $$invalidate(2, css_observer = $$props.css_observer);
    		if ('css_animation' in $$props) $$invalidate(3, css_animation = $$props.css_animation);
    		if ('observing' in $$props) $$invalidate(4, observing = $$props.observing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*observing*/ 16) {
    			dispatch('update', { observing });
    		}
    	};

    	return [
    		animation,
    		animation_out,
    		css_observer,
    		css_animation,
    		observing,
    		countainer,
    		once,
    		top,
    		bottom,
    		$$scope,
    		slots
    	];
    }

    class Saos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			animation: 0,
    			animation_out: 1,
    			once: 6,
    			top: 7,
    			bottom: 8,
    			css_observer: 2,
    			css_animation: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Saos",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get animation() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation_out() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation_out(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get once() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css_observer() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css_observer(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css_animation() {
    		throw new Error("<Saos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css_animation(value) {
    		throw new Error("<Saos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LessonList.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\components\\LessonList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (11:4) {#if lesson_ids.includes(lesson.id)}
    function create_if_block$4(ctx) {
    	let saos;
    	let current;

    	saos = new Saos({
    			props: {
    				animation: "scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(saos.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(saos, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const saos_changes = {};

    			if (dirty & /*$$scope, $LessonStore*/ 34) {
    				saos_changes.$$scope = { dirty, ctx };
    			}

    			saos.$set(saos_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(saos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(saos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(saos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(11:4) {#if lesson_ids.includes(lesson.id)}",
    		ctx
    	});

    	return block;
    }

    // (12:6) <Saos          animation={"scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"}        >
    function create_default_slot$5(ctx) {
    	let lessondetails;
    	let t;
    	let current;

    	lessondetails = new LessonDetails({
    			props: { lesson: /*lesson*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(lessondetails.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(lessondetails, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lessondetails_changes = {};
    			if (dirty & /*$LessonStore*/ 2) lessondetails_changes.lesson = /*lesson*/ ctx[2];
    			lessondetails.$set(lessondetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lessondetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lessondetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lessondetails, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(12:6) <Saos          animation={\\\"scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both\\\"}        >",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each $LessonStore as lesson (lesson.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let show_if = /*lesson_ids*/ ctx[0].includes(/*lesson*/ ctx[2].id);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block$4(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*lesson_ids, $LessonStore*/ 3) show_if = /*lesson_ids*/ ctx[0].includes(/*lesson*/ ctx[2].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*lesson_ids, $LessonStore*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(10:2) {#each $LessonStore as lesson (lesson.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$LessonStore*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*lesson*/ ctx[2].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "lesson-list svelte-1so5c0b");
    			add_location(div, file$7, 8, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$LessonStore, lesson_ids*/ 3) {
    				each_value = /*$LessonStore*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $LessonStore;
    	validate_store(LessonStore, 'LessonStore');
    	component_subscribe($$self, LessonStore, $$value => $$invalidate(1, $LessonStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LessonList', slots, []);
    	let { lesson_ids } = $$props;
    	const writable_props = ['lesson_ids'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LessonList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lesson_ids' in $$props) $$invalidate(0, lesson_ids = $$props.lesson_ids);
    	};

    	$$self.$capture_state = () => ({
    		LessonDetails,
    		LessonStore,
    		Saos,
    		lesson_ids,
    		$LessonStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('lesson_ids' in $$props) $$invalidate(0, lesson_ids = $$props.lesson_ids);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lesson_ids, $LessonStore];
    }

    class LessonList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { lesson_ids: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LessonList",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lesson_ids*/ ctx[0] === undefined && !('lesson_ids' in props)) {
    			console.warn("<LessonList> was created without expected prop 'lesson_ids'");
    		}
    	}

    	get lesson_ids() {
    		throw new Error("<LessonList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lesson_ids(value) {
    		throw new Error("<LessonList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LessonPage.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\components\\LessonPage.svelte";

    // (24:57) <Link target="https://github.com/Totemi1324/TSPquantum" newPage={true}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("the project's GitHub repo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(24:57) <Link target=\\\"https://github.com/Totemi1324/TSPquantum\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let p2;
    	let t14;
    	let link;
    	let t15;
    	let t16;
    	let strong;
    	let t18;
    	let hr;
    	let t19;
    	let h20;
    	let t21;
    	let lessonlist0;
    	let t22;
    	let h21;
    	let t24;
    	let lessonlist1;
    	let t25;
    	let h22;
    	let t27;
    	let lessonlist2;
    	let t28;
    	let h23;
    	let t30;
    	let lessonlist3;
    	let t31;
    	let h24;
    	let t33;
    	let lessonlist4;
    	let current;

    	link = new Link({
    			props: {
    				target: "https://github.com/Totemi1324/TSPquantum",
    				newPage: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	lessonlist0 = new LessonList({
    			props: { lesson_ids: ["BxESn", "eLyUg", "Z30Ce"] },
    			$$inline: true
    		});

    	lessonlist1 = new LessonList({
    			props: { lesson_ids: ["m2MJl", "xR66u"] },
    			$$inline: true
    		});

    	lessonlist2 = new LessonList({
    			props: {
    				lesson_ids: ["yV8O6", "0nRrT", "EFTOp", "m9UPL"]
    			},
    			$$inline: true
    		});

    	lessonlist3 = new LessonList({
    			props: { lesson_ids: ["okhMZ", "_Z9Gv", "ufr4r"] },
    			$$inline: true
    		});

    	lessonlist4 = new LessonList({
    			props: { lesson_ids: ["U7uiF"] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "When we have to travel long distances, we want to get from one place to\r\n    another as quickly as possible. This challenge of precise route planning was\r\n    and is faced by people long ago as well as today. But can quantum physics\r\n    take this work off our hands?";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "This notebook is a comprehensive guide to the quantum mechanical approach to this age-old optimization problem. You will learn:";
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "What graphs are and how to perform calculations on them";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "How QUBO problems are constructed";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "How the Traveling Salesman Problem can be represented as a Hamiltonian for quantum annealers";
    			t9 = space();
    			li3 = element("li");
    			li3.textContent = "What the advantages and drawbacks of this method are";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "How to perform pathfinding on your own graphs";
    			t13 = space();
    			p2 = element("p");
    			t14 = text("If you're looking for further information, check out ");
    			create_component(link.$$.fragment);
    			t15 = text(".");
    			t16 = space();
    			strong = element("strong");
    			strong.textContent = "Have fun learning!";
    			t18 = space();
    			hr = element("hr");
    			t19 = space();
    			h20 = element("h2");
    			h20.textContent = "Chapter 1";
    			t21 = space();
    			create_component(lessonlist0.$$.fragment);
    			t22 = space();
    			h21 = element("h2");
    			h21.textContent = "Chapter 2";
    			t24 = space();
    			create_component(lessonlist1.$$.fragment);
    			t25 = space();
    			h22 = element("h2");
    			h22.textContent = "Chapter 3";
    			t27 = space();
    			create_component(lessonlist2.$$.fragment);
    			t28 = space();
    			h23 = element("h2");
    			h23.textContent = "Chapter 4";
    			t30 = space();
    			create_component(lessonlist3.$$.fragment);
    			t31 = space();
    			h24 = element("h2");
    			h24.textContent = "Chapter 5";
    			t33 = space();
    			create_component(lessonlist4.$$.fragment);
    			add_location(p0, file$6, 6, 2, 139);
    			add_location(p1, file$6, 12, 2, 427);
    			add_location(li0, file$6, 16, 4, 585);
    			add_location(li1, file$6, 17, 4, 655);
    			add_location(li2, file$6, 18, 4, 703);
    			add_location(li3, file$6, 19, 4, 810);
    			add_location(li4, file$6, 20, 4, 877);
    			add_location(ul, file$6, 15, 2, 575);
    			add_location(p2, file$6, 22, 2, 944);
    			add_location(strong, file$6, 25, 2, 1122);
    			attr_dev(hr, "class", "svelte-14fhlgu");
    			add_location(hr, file$6, 26, 2, 1161);
    			attr_dev(h20, "class", "svelte-14fhlgu");
    			add_location(h20, file$6, 27, 2, 1171);
    			attr_dev(h21, "class", "svelte-14fhlgu");
    			add_location(h21, file$6, 29, 2, 1252);
    			attr_dev(h22, "class", "svelte-14fhlgu");
    			add_location(h22, file$6, 31, 2, 1324);
    			attr_dev(h23, "class", "svelte-14fhlgu");
    			add_location(h23, file$6, 33, 2, 1414);
    			attr_dev(h24, "class", "svelte-14fhlgu");
    			add_location(h24, file$6, 35, 2, 1495);
    			attr_dev(div, "class", "home");
    			add_location(div, file$6, 5, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(div, t13);
    			append_dev(div, p2);
    			append_dev(p2, t14);
    			mount_component(link, p2, null);
    			append_dev(p2, t15);
    			append_dev(div, t16);
    			append_dev(div, strong);
    			append_dev(div, t18);
    			append_dev(div, hr);
    			append_dev(div, t19);
    			append_dev(div, h20);
    			append_dev(div, t21);
    			mount_component(lessonlist0, div, null);
    			append_dev(div, t22);
    			append_dev(div, h21);
    			append_dev(div, t24);
    			mount_component(lessonlist1, div, null);
    			append_dev(div, t25);
    			append_dev(div, h22);
    			append_dev(div, t27);
    			mount_component(lessonlist2, div, null);
    			append_dev(div, t28);
    			append_dev(div, h23);
    			append_dev(div, t30);
    			mount_component(lessonlist3, div, null);
    			append_dev(div, t31);
    			append_dev(div, h24);
    			append_dev(div, t33);
    			mount_component(lessonlist4, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(lessonlist0.$$.fragment, local);
    			transition_in(lessonlist1.$$.fragment, local);
    			transition_in(lessonlist2.$$.fragment, local);
    			transition_in(lessonlist3.$$.fragment, local);
    			transition_in(lessonlist4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(lessonlist0.$$.fragment, local);
    			transition_out(lessonlist1.$$.fragment, local);
    			transition_out(lessonlist2.$$.fragment, local);
    			transition_out(lessonlist3.$$.fragment, local);
    			transition_out(lessonlist4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    			destroy_component(lessonlist0);
    			destroy_component(lessonlist1);
    			destroy_component(lessonlist2);
    			destroy_component(lessonlist3);
    			destroy_component(lessonlist4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LessonPage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LessonPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, LessonList });
    	return [];
    }

    class LessonPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LessonPage",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\DownloadDetails.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\components\\DownloadDetails.svelte";

    // (11:53) <Button flat={true} inverse={false}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Download");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(11:53) <Button flat={true} inverse={false}>",
    		ctx
    	});

    	return block;
    }

    // (15:8) {#if download.type === "EXE"}
    function create_if_block_3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "fa fa-arrow-pointer");
    			add_location(span, file$5, 15, 10, 691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(15:8) {#if download.type === \\\"EXE\\\"}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if download.type === "IPYNB"}
    function create_if_block_2$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "fa fa-laptop-code");
    			add_location(span, file$5, 18, 10, 795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(18:8) {#if download.type === \\\"IPYNB\\\"}",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#if download.type === "JSON"}
    function create_if_block_1$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "fa fa-code");
    			add_location(span, file$5, 21, 10, 896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(21:8) {#if download.type === \\\"JSON\\\"}",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#if download.type === "PDF"}
    function create_if_block$3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "fa fa-file");
    			add_location(span, file$5, 24, 10, 989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(24:8) {#if download.type === \\\"PDF\\\"}",
    		ctx
    	});

    	return block;
    }

    // (8:0) <Card>
    function create_default_slot$3(ctx) {
    	let div1;
    	let h4;
    	let t0_value = /*download*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3_value = /*download*/ ctx[0].fsize + "";
    	let t3;
    	let t4;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let p0;
    	let t6_value = /*download*/ ctx[0].desc + "";
    	let t6;
    	let t7;
    	let div0;
    	let p1;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12_value = /*download*/ ctx[0].type + "";
    	let t12;
    	let current;

    	button = new Button({
    			props: {
    				flat: true,
    				inverse: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*download*/ ctx[0].type === "EXE" && create_if_block_3(ctx);
    	let if_block1 = /*download*/ ctx[0].type === "IPYNB" && create_if_block_2$1(ctx);
    	let if_block2 = /*download*/ ctx[0].type === "JSON" && create_if_block_1$2(ctx);
    	let if_block3 = /*download*/ ctx[0].type === "PDF" && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text("• ");
    			t3 = text(t3_value);
    			t4 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			t5 = space();
    			p0 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			div0 = element("div");
    			p1 = element("p");
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();
    			if (if_block3) if_block3.c();
    			t11 = space();
    			t12 = text(t12_value);
    			attr_dev(span, "class", "dl-fsize svelte-11tqi5x");
    			add_location(span, file$5, 9, 42, 225);
    			attr_dev(h4, "class", "dl-title svelte-11tqi5x");
    			add_location(h4, file$5, 9, 4, 187);
    			attr_dev(a, "href", a_href_value = /*download*/ ctx[0].href);
    			attr_dev(a, "class", "dl-href svelte-11tqi5x");
    			attr_dev(a, "download", "");
    			add_location(a, file$5, 10, 4, 289);
    			attr_dev(p0, "class", "dl-desc svelte-11tqi5x");
    			add_location(p0, file$5, 11, 4, 401);
    			attr_dev(p1, "class", "svelte-11tqi5x");
    			add_location(p1, file$5, 13, 6, 637);
    			attr_dev(div0, "class", "dl-type unselectable svelte-11tqi5x");
    			toggle_class(div0, "exe", /*download*/ ctx[0].type === "EXE");
    			toggle_class(div0, "ipynb", /*download*/ ctx[0].type === "IPYNB");
    			toggle_class(div0, "json", /*download*/ ctx[0].type === "JSON");
    			toggle_class(div0, "pdf", /*download*/ ctx[0].type === "PDF");
    			add_location(div0, file$5, 12, 4, 445);
    			attr_dev(div1, "class", "download svelte-11tqi5x");
    			add_location(div1, file$5, 8, 2, 159);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, span);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(div1, t4);
    			append_dev(div1, a);
    			mount_component(button, a, null);
    			append_dev(div1, t5);
    			append_dev(div1, p0);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			append_dev(div0, p1);
    			if (if_block0) if_block0.m(p1, null);
    			append_dev(p1, t8);
    			if (if_block1) if_block1.m(p1, null);
    			append_dev(p1, t9);
    			if (if_block2) if_block2.m(p1, null);
    			append_dev(p1, t10);
    			if (if_block3) if_block3.m(p1, null);
    			append_dev(p1, t11);
    			append_dev(p1, t12);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*download*/ 1) && t0_value !== (t0_value = /*download*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*download*/ 1) && t3_value !== (t3_value = /*download*/ ctx[0].fsize + "")) set_data_dev(t3, t3_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty & /*download*/ 1 && a_href_value !== (a_href_value = /*download*/ ctx[0].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*download*/ 1) && t6_value !== (t6_value = /*download*/ ctx[0].desc + "")) set_data_dev(t6, t6_value);

    			if (/*download*/ ctx[0].type === "EXE") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(p1, t8);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*download*/ ctx[0].type === "IPYNB") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(p1, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*download*/ ctx[0].type === "JSON") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1$2(ctx);
    					if_block2.c();
    					if_block2.m(p1, t10);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*download*/ ctx[0].type === "PDF") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block$3(ctx);
    					if_block3.c();
    					if_block3.m(p1, t11);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if ((!current || dirty & /*download*/ 1) && t12_value !== (t12_value = /*download*/ ctx[0].type + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*download*/ 1) {
    				toggle_class(div0, "exe", /*download*/ ctx[0].type === "EXE");
    			}

    			if (dirty & /*download*/ 1) {
    				toggle_class(div0, "ipynb", /*download*/ ctx[0].type === "IPYNB");
    			}

    			if (dirty & /*download*/ 1) {
    				toggle_class(div0, "json", /*download*/ ctx[0].type === "JSON");
    			}

    			if (dirty & /*download*/ 1) {
    				toggle_class(div0, "pdf", /*download*/ ctx[0].type === "PDF");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(8:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, download*/ 3) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DownloadDetails', slots, []);
    	let { download } = $$props;
    	const writable_props = ['download'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DownloadDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('download' in $$props) $$invalidate(0, download = $$props.download);
    	};

    	$$self.$capture_state = () => ({ Card, Button, download });

    	$$self.$inject_state = $$props => {
    		if ('download' in $$props) $$invalidate(0, download = $$props.download);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [download];
    }

    class DownloadDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { download: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadDetails",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*download*/ ctx[0] === undefined && !('download' in props)) {
    			console.warn("<DownloadDetails> was created without expected prop 'download'");
    		}
    	}

    	get download() {
    		throw new Error("<DownloadDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set download(value) {
    		throw new Error("<DownloadDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const DownloadsStore = writable([
        {
            id: "WQnhY",
            title: "Graph To Matrix - TSPQ",
            desc: "A helper program to visually design graphs on a canvas and export their Hamiltonian with one click as an input for the quantum annealers",
            fsize: "8.7 MB",
            type: "EXE",
            href: "../docs/Graph to Matrix - TSPQ.exe"
        },
        {
            id: "2Jmfy",
            title: "Path Visualizer - TSPQ",
            desc: "A helper program to read and visualize the solutions of quantum annealers to Traveling Salesman Problems on a canvas",
            fsize: "8.7 MB",
            type: "EXE",
            href: "../docs/Path Visualizer - TSPQ.exe"
        },
        {
            id: "APf1g",
            title: "Tutorial notebook",
            desc: "An interactive Python notebook for those who are interested in the code for this course, including tutorials on how to interact with the D-Wave quantum annealers",
            fsize: "1.2 MB",
            type: "IPYNB",
            href: "../docs/Solving the Traveling Salesman Problem with quantum annealers.ipynb"
        },
        {
            id: "HQerk",
            title: "Experimental results database",
            desc: "This file contains the raw data of the measurements made to evaluate the performance of the TSP quantum algorithm; useful for plotting your own graphs, can be read by various JSON libraries",
            fsize: "44.3 KB",
            type: "JSON",
            href: "../docs/data.json"
        },
        {
            id: "Pv9Rq",
            title: "Resultsbook",
            desc: "All relevant experimental and benchmarking data, concatenated into a single document; contains the Hamiltonians and data plots for graphs of all solvable sizes, free for print production",
            fsize: "2.5 MB",
            type: "PDF",
            href: "../docs/Resultsbook.pdf"
        },
    ]);

    /* src\components\DownloadList.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\components\\DownloadList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (11:4) {#if download_ids.includes(download.id)}
    function create_if_block$2(ctx) {
    	let saos;
    	let current;

    	saos = new Saos({
    			props: {
    				animation: "swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(saos.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(saos, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const saos_changes = {};

    			if (dirty & /*$$scope, $DownloadsStore*/ 34) {
    				saos_changes.$$scope = { dirty, ctx };
    			}

    			saos.$set(saos_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(saos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(saos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(saos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(11:4) {#if download_ids.includes(download.id)}",
    		ctx
    	});

    	return block;
    }

    // (12:6) <Saos animation={"swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both"}>
    function create_default_slot$2(ctx) {
    	let downloaddetails;
    	let t;
    	let current;

    	downloaddetails = new DownloadDetails({
    			props: { download: /*download*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(downloaddetails.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(downloaddetails, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const downloaddetails_changes = {};
    			if (dirty & /*$DownloadsStore*/ 2) downloaddetails_changes.download = /*download*/ ctx[2];
    			downloaddetails.$set(downloaddetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloaddetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloaddetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(downloaddetails, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:6) <Saos animation={\\\"swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each $DownloadsStore as download (download.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let show_if = /*download_ids*/ ctx[0].includes(/*download*/ ctx[2].id);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*download_ids, $DownloadsStore*/ 3) show_if = /*download_ids*/ ctx[0].includes(/*download*/ ctx[2].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*download_ids, $DownloadsStore*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:2) {#each $DownloadsStore as download (download.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$DownloadsStore*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*download*/ ctx[2].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "download-list svelte-1ilywvv");
    			add_location(div, file$4, 8, 0, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$DownloadsStore, download_ids*/ 3) {
    				each_value = /*$DownloadsStore*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $DownloadsStore;
    	validate_store(DownloadsStore, 'DownloadsStore');
    	component_subscribe($$self, DownloadsStore, $$value => $$invalidate(1, $DownloadsStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DownloadList', slots, []);
    	let { download_ids } = $$props;
    	const writable_props = ['download_ids'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DownloadList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('download_ids' in $$props) $$invalidate(0, download_ids = $$props.download_ids);
    	};

    	$$self.$capture_state = () => ({
    		DownloadDetails,
    		DownloadsStore,
    		Saos,
    		download_ids,
    		$DownloadsStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('download_ids' in $$props) $$invalidate(0, download_ids = $$props.download_ids);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [download_ids, $DownloadsStore];
    }

    class DownloadList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { download_ids: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadList",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*download_ids*/ ctx[0] === undefined && !('download_ids' in props)) {
    			console.warn("<DownloadList> was created without expected prop 'download_ids'");
    		}
    	}

    	get download_ids() {
    		throw new Error("<DownloadList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set download_ids(value) {
    		throw new Error("<DownloadList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DownloadPage.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\DownloadPage.svelte";

    // (9:213) <Link target="mailto:guidewalk.geraet@gmail.com" newPage={true}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("guidewalk.geraet@gmail.com");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(9:213) <Link target=\\\"mailto:guidewalk.geraet@gmail.com\\\" newPage={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let link;
    	let t3;
    	let t4;
    	let h30;
    	let t6;
    	let downloadlist0;
    	let t7;
    	let h31;
    	let t9;
    	let downloadlist1;
    	let current;

    	link = new Link({
    			props: {
    				target: "mailto:guidewalk.geraet@gmail.com",
    				newPage: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	downloadlist0 = new DownloadList({
    			props: { download_ids: ["WQnhY", "2Jmfy"] },
    			$$inline: true
    		});

    	downloadlist1 = new DownloadList({
    			props: {
    				download_ids: ["APf1g", "HQerk", "Pv9Rq"]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Download area";
    			t1 = space();
    			p = element("p");
    			t2 = text("Here, you can find all files related to this course and the TSPquantum project for free download. If you can't find what you're searching for and are interested in additional data, please send your request to ");
    			create_component(link.$$.fragment);
    			t3 = text(". All the following files are for research-related and non-commercial use only and an unauthorised publication and/or reproduction on platforms other than this is prohibited, unless disclosed otherwise.");
    			t4 = space();
    			h30 = element("h3");
    			h30.textContent = "Applications";
    			t6 = space();
    			create_component(downloadlist0.$$.fragment);
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Others";
    			t9 = space();
    			create_component(downloadlist1.$$.fragment);
    			attr_dev(h2, "class", "svelte-1ltwy4e");
    			add_location(h2, file$3, 6, 2, 152);
    			add_location(p, file$3, 7, 2, 178);
    			add_location(h30, file$3, 10, 2, 707);
    			add_location(h31, file$3, 12, 2, 785);
    			attr_dev(div, "class", "downloads");
    			add_location(div, file$3, 5, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			mount_component(link, p, null);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			append_dev(div, h30);
    			append_dev(div, t6);
    			mount_component(downloadlist0, div, null);
    			append_dev(div, t7);
    			append_dev(div, h31);
    			append_dev(div, t9);
    			mount_component(downloadlist1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(downloadlist0.$$.fragment, local);
    			transition_in(downloadlist1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(downloadlist0.$$.fragment, local);
    			transition_out(downloadlist1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    			destroy_component(downloadlist0);
    			destroy_component(downloadlist1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DownloadPage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DownloadPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, DownloadList });
    	return [];
    }

    class DownloadPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadPage",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules\svelte-simple-modal\src\Modal.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$2 = "node_modules\\svelte-simple-modal\\src\\Modal.svelte";

    // (401:0) {#if Component}
    function create_if_block$1(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1$1(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-lta5m0"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$2, 444, 8, 11301);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-lta5m0"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$2, 416, 6, 10354);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-lta5m0"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$2, 410, 4, 10221);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-lta5m0"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$2, 401, 2, 9975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[48](div1);
    			/*div2_binding*/ ctx[49](div2);
    			/*div3_binding*/ ctx[50](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-lta5m0"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-lta5m0"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-lta5m0"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-lta5m0"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[48](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[49](null);
    			/*div3_binding*/ ctx[50](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(401:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (432:8) {#if state.closeButton}
    function create_if_block_1$1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(432:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (435:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-lta5m0"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$2, 435, 12, 11050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-lta5m0"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(435:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (433:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(433:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[47].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(45, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(45, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 4194304 | $$self.$$.dirty[1] & /*isMounted*/ 16384) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				show: 22,
    				key: 23,
    				ariaLabel: 24,
    				ariaLabelledBy: 25,
    				closeButton: 26,
    				closeOnEsc: 27,
    				closeOnOuterClick: 28,
    				styleBg: 29,
    				styleWindowWrap: 30,
    				styleWindow: 31,
    				styleContent: 32,
    				styleCloseButton: 33,
    				classBg: 34,
    				classWindowWrap: 35,
    				classWindow: 36,
    				classContent: 37,
    				classCloseButton: 38,
    				unstyled: 0,
    				setContext: 39,
    				transitionBg: 40,
    				transitionBgProps: 41,
    				transitionWindow: 42,
    				transitionWindowProps: 43,
    				disableFocusTrap: 44
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\shared\Tabs.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\shared\\Tabs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:4) {#each pages as page}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let t0_value = /*page*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*page*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "unselectable svelte-v2pa63");
    			toggle_class(div, "active", /*page*/ ctx[4] === /*activePage*/ ctx[1]);
    			add_location(div, file$1, 15, 8, 379);
    			attr_dev(li, "class", "svelte-v2pa63");
    			add_location(li, file$1, 14, 6, 320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*pages*/ 1 && t0_value !== (t0_value = /*page*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*pages, activePage*/ 3) {
    				toggle_class(div, "active", /*page*/ ctx[4] === /*activePage*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:4) {#each pages as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let ul;
    	let each_value = /*pages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-v2pa63");
    			add_location(ul, file$1, 12, 2, 281);
    			attr_dev(div, "class", "tabs svelte-v2pa63");
    			add_location(div, file$1, 11, 0, 259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, pages, activePage*/ 7) {
    				each_value = /*pages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	const dispatch = createEventDispatcher();
    	let { pages } = $$props;
    	let { activePage } = $$props;
    	const writable_props = ['pages', 'activePage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = page => dispatch("tabChange", page);

    	$$self.$$set = $$props => {
    		if ('pages' in $$props) $$invalidate(0, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(1, activePage = $$props.activePage);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tweened,
    		cubicOut,
    		dispatch,
    		pages,
    		activePage
    	});

    	$$self.$inject_state = $$props => {
    		if ('pages' in $$props) $$invalidate(0, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(1, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pages, activePage, dispatch, click_handler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { pages: 0, activePage: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pages*/ ctx[0] === undefined && !('pages' in props)) {
    			console.warn("<Tabs> was created without expected prop 'pages'");
    		}

    		if (/*activePage*/ ctx[1] === undefined && !('activePage' in props)) {
    			console.warn("<Tabs> was created without expected prop 'activePage'");
    		}
    	}

    	get pages() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pages(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activePage() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activePage(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (22:4) {#if activePage === "Lessons"}
    function create_if_block_1(ctx) {
    	let lessonpage;
    	let current;
    	lessonpage = new LessonPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lessonpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lessonpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lessonpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lessonpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lessonpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:4) {#if activePage === \\\"Lessons\\\"}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if activePage === "Downloads"}
    function create_if_block(ctx) {
    	let downloadpage;
    	let current;
    	downloadpage = new DownloadPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(downloadpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(downloadpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(downloadpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(25:4) {#if activePage === \\\"Downloads\\\"}",
    		ctx
    	});

    	return block;
    }

    // (20:0) <Modal>
    function create_default_slot(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let footer;
    	let current;
    	let if_block0 = /*activePage*/ ctx[0] === "Lessons" && create_if_block_1(ctx);
    	let if_block1 = /*activePage*/ ctx[0] === "Downloads" && create_if_block(ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-3yykcz");
    			add_location(main, file, 20, 2, 548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			if (if_block1) if_block1.m(main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*activePage*/ ctx[0] === "Lessons") {
    				if (if_block0) {
    					if (dirty & /*activePage*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*activePage*/ ctx[0] === "Downloads") {
    				if (if_block1) {
    					if (dirty & /*activePage*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(20:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let tabs;
    	let t1;
    	let modal;
    	let current;
    	header = new Header({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				activePage: /*activePage*/ ctx[0],
    				pages: /*pages*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabs.$on("tabChange", /*tabChange*/ ctx[2]);

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(tabs.$$.fragment);
    			t1 = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tabs, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};
    			if (dirty & /*activePage*/ 1) tabs_changes.activePage = /*activePage*/ ctx[0];
    			tabs.$set(tabs_changes);
    			const modal_changes = {};

    			if (dirty & /*$$scope, activePage*/ 9) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tabs, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let pages = ["Lessons", "Demo", "Downloads"];
    	let activePage = "Lessons";

    	const tabChange = e => {
    		$$invalidate(0, activePage = e.detail);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		LessonPage,
    		DownloadPage,
    		Modal,
    		Tabs,
    		pages,
    		activePage,
    		tabChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('pages' in $$props) $$invalidate(1, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(0, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activePage, pages, tabChange];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
