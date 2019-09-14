/*
 * Copyright 2019 WICKLETS LLC
 *
 * This file is part of Wick Engine.
 *
 * Wick Engine is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Engine is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Engine.  If not, see <https://www.gnu.org/licenses/>.
 */

Wick.GUIElement = class {
    /**
     * Create a new GUIElement
     * @param {Wick.Base} model - The object containing the data to use to draw this GUIElement
     */
    constructor (model) {
        this.model = model;
    }

    /**
     * The object to use the data from to create this GUIElement
     * @type {Wick.Base}
     */
    set model (model) {
        this._model = model;
    }

    get model () {
        return this._model;
    }

    /**
     * The root GUIElement.
     * @type {Wick.GUIElement}
     */
    get project () {
        return this.model.project.guiElement;
    }

    /**
     * The canvas that this GUIElement belongs to.
     */
    get canvas () {
        return this.project._canvas;
    }

    /**
     * The context of the canvas that this GUIElement belongs to.
     */
    get ctx () {
        return this.model.project.guiElement._ctx;
    }

    /**
     * The current translation of the canvas. NOTE: This won't work without the following polyfill:
     * https://github.com/goessner/canvas-currentTransform
     * @type {object}
     */
    get currentTranslation () {
        var transform = this.ctx.currentTransform;
        return {
            x: transform.e,
            y: transform.f,
        };
    }

    /**
     * A copy of the transformation of the canvas when this object was drawn.
     * @type {object}
     */
    get localTranslation () {
        return this._localTranslation;
    }

    /**
     * The current grid cell width that all GUIElements are based off of.
     * @type {number}
     */
    get gridCellWidth () {
        return Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH;
    }

    /**
     * The current grid cell height that all GUIElements are based off of.
     * @type {number}
     */
    get gridCellHeight () {
        return Wick.GUIElement.GRID_DEFAULT_CELL_HEIGHT;
    }

    /**
     * The bounding box of the hit area for mouse interactions.
     * @type {object}
     */
    get bounds () {
        // Implemeneted by subclasses
        return null;
    }

    /**
     * The position of the mouse relative to this elements translation.
     * @type {object}
     */
    get localMouse () {
        var translation = this.localTranslation;
        var localMouse = {
            x: this.project._mouse.x - translation.x,
            y: this.project._mouse.y - translation.y,
        };
        return localMouse;
    }

    /**
     * Checks if this object is touching the mouse.
     * @returns {boolean}
     */
    mouseInBounds (mouse) {
        if(!this.bounds) return false;

        var localMouse = this.localMouse;
        var bounds = this.bounds;
        return localMouse.x > bounds.x &&
               localMouse.y > bounds.y &&
               localMouse.x < bounds.x + bounds.width &&
               localMouse.y < bounds.y + bounds.height;
    }

    /**
     * Check if the mouse is hovering or clicking this element.
     * @type {string}
     */
    get mouseState () {
        var targets = this.project._mouseHoverTargets;
        var l = targets.length - 1;
        /*if(this.project.mouseDragTargets.indexOf(this) !== -1) {
            return 'down';
        } else */if(targets[l] === this) {
            return 'over';
        } else {
            return 'out';
        }
    }

    /**
     * Draw this GUIElement
     */
    draw () {
        this._localTranslation = this.currentTranslation;
        this.project.markElementAsDrawn(this);
    }

    /**
     * The classname of the ghost object to create when this object is dragged.
     * @type {string}
     */
    get dragGhostClassname () {
        return null; // Implemeneted by subclasses.
    }

    /**
     * The function to call when the mouse clicks this element.
     */
    onMouseDown (e) {
        // Implemeneted by subclasses.
    }

    /**
     * The function to call when the mouse drags this element.
     */
    onMouseDrag (e) {
        // Implemeneted by subclasses.
    }
}

Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH = 38;
Wick.GUIElement.GRID_DEFAULT_CELL_HEIGHT = 42;
Wick.GUIElement.FRAMES_STRIP_HEIGHT = 40;
Wick.GUIElement.GRID_MARGIN = Wick.GUIElement.GRID_DEFAULT_CELL_HEIGHT - Wick.GUIElement.FRAMES_STRIP_HEIGHT;

Wick.GUIElement.TIMELINE_BACKGROUND_COLOR = '#2A2E30';

Wick.GUIElement.SELECTED_ITEM_BORDER_COLOR = '#00ADEF';

Wick.GUIElement.BREADCRUMBS_HEIGHT = 30;
Wick.GUIElement.BREADCRUMBS_BG_COLOR = '#202122';
Wick.GUIElement.BREADCRUMBS_ACTIVE_BUTTON_FILL_COLOR = '#2A2E30';
Wick.GUIElement.BREADCRUMBS_INACTIVE_BUTTON_FILL_COLOR = '#202122';
Wick.GUIElement.BREADCRUMBS_HOVER_BUTTON_FILL_COLOR = '#6F6F6F';
Wick.GUIElement.BREADCRUMBS_SHADOW_COLOR = '#000000';
Wick.GUIElement.BREADCRUMBS_DROP_SHADOW_DEPTH = 2;
Wick.GUIElement.BREADCRUMBS_ACTIVE_BORDER_COLOR = '#1EE29A';
Wick.GUIElement.BREADCRUMBS_HIGHLIGHT_HEIGHT = 3;
Wick.GUIElement.BREADCRUMBS_PADDING = 5;

Wick.GUIElement.LAYERS_CONTAINER_WIDTH = 195;

Wick.GUIElement.NUMBER_LINE_HEIGHT = 35;
Wick.GUIElement.NUMBER_LINE_NUMBERS_HIGHLIGHT_COLOR = '#ffffff';
Wick.GUIElement.NUMBER_LINE_NUMBERS_COMMON_COLOR = '#494949';
Wick.GUIElement.NUMBER_LINE_NUMBERS_FONT_FAMILY = 'PT Mono';
Wick.GUIElement.NUMBER_LINE_NUMBERS_FONT_SIZE = '18';

Wick.GUIElement.FRAME_HEIGHT = Wick.GUIElement.FRAMES_STRIP_HEIGHT;
Wick.GUIElement.FRAME_HOVERED_OVER = '#D3F8F4';
Wick.GUIElement.FRAME_TWEENED_HOVERED_OVER = '#bbbbee';
Wick.GUIElement.FRAME_CONTENTFUL_FILL_COLOR = '#ffffff';
Wick.GUIElement.FRAME_UNCONTENTFUL_FILL_COLOR = '#ffffff';
Wick.GUIElement.FRAME_TWEENED_FILL_COLOR = '#ffffff';
Wick.GUIElement.FRAME_BORDER_RADIUS = 5;
Wick.GUIElement.FRAME_CONTENT_DOT_RADIUS = 7;
Wick.GUIElement.FRAME_CONTENT_DOT_STROKE_WIDTH = 3;
Wick.GUIElement.FRAME_CONTENT_DOT_COLOR = '#1EE29A';
Wick.GUIElement.FRAME_MARGIN = 0.5;
Wick.GUIElement.FRAME_DROP_SHADOW_DEPTH = 2; // Number of pixels to shift drop shadow below frame.
Wick.GUIElement.FRAME_DROP_SHADOW_FILL = 'rgba(0,0,0,1)';
Wick.GUIElement.FRAME_SCRIPT_DOT_COLOR = '#F5A623';

Wick.GUIElement.FRAME_HANDLE_HOVER_FILL_COLOR = Wick.GUIElement.SELECTED_ITEM_BORDER_COLOR;
Wick.GUIElement.FRAME_HANDLE_WIDTH = 8;

Wick.GUIElement.TWEEN_DIAMOND_RADIUS = 7;
Wick.GUIElement.TWEEN_STROKE_WIDTH = 3;
Wick.GUIElement.TWEEN_FILL_COLOR_1 = '#494949';
Wick.GUIElement.TWEEN_FILL_COLOR_2 = '#8E8E8E';
Wick.GUIElement.TWEEN_HOVER_COLOR_1 = '#09C07D';
Wick.GUIElement.TWEEN_HOVER_COLOR_2 = '#1EE29A';
Wick.GUIElement.TWEEN_STROKE_COLOR = '#222244';

Wick.GUIElement.TWEEN_ARROW_STROKE_WIDTH = 3;
Wick.GUIElement.TWEEN_ARROW_STROKE_COLOR = '#D8D8D8';

Wick.GUIElement.FRAME_GHOST_COLOR = Wick.GUIElement.SELECTED_ITEM_BORDER_COLOR;
Wick.GUIElement.FRAME_GHOST_OPACITY = .45;
Wick.GUIElement.FRAME_GHOST_STROKE_WIDTH = 5;
Wick.GUIElement.FRAME_HIGHLIGHT_STROKEWIDTH = 3;

Wick.GUIElement.FRAMES_STRIP_VERTICAL_MARGIN = 4;
Wick.GUIElement.FRAMES_STRIP_ACTIVE_FILL_COLOR = 'rgba(216, 216, 216, 0.31)';
Wick.GUIElement.FRAMES_STRIP_INACTIVE_FILL_COLOR = 'rgba(95, 97, 99, 0.31)';
Wick.GUIElement.FRAMES_STRIP_BORDER_RADIUS = 4;

Wick.GUIElement.ADD_FRAME_OVERLAY_FILL_COLOR = '#9E9E9E';
Wick.GUIElement.ADD_FRAME_OVERLAY_PLUS_COLOR = '#191919';

Wick.GUIElement.FRAMES_CONTAINER_VERTICAL_GRID_STROKE_COLOR = 'rgba(0,0,0,0.2)';
Wick.GUIElement.FRAMES_CONTAINER_VERTICAL_GRID_HIGHLIGHT_STROKE_COLOR = 'rgba(255,255,255,0.3)';
Wick.GUIElement.FRAMES_CONTAINER_VERTICAL_GRID_STROKE_WIDTH = 2.5;

Wick.GUIElement.PLAYHEAD_FILL_COLOR = '#FF5C5C';
Wick.GUIElement.PLAYHEAD_STROKE_COLOR = '#D83333';
Wick.GUIElement.PLAYHEAD_STROKE_WIDTH = 3;
Wick.GUIElement.PLAYHEAD_MARGIN = 8;

Wick.GUIElement.LAYER_LABEL_ACTIVE_FILL_COLOR = '#1EE29A';
Wick.GUIElement.LAYER_LABEL_INACTIVE_FILL_COLOR = '#B7B7B7';
Wick.GUIElement.LAYER_LABEL_HIDDEN_FILL_COLOR = 'rgba(183, 183, 183, .1)';
Wick.GUIElement.LAYER_LABEL_BORDER_RADIUS = 3;
Wick.GUIElement.LAYER_LABEL_MARGIN_TOP_BOTTOM = 4;
Wick.GUIElement.LAYER_LABEL_MARGIN_SIDES = 4;
Wick.GUIElement.LAYER_LABEL_FONT_FAMILY = 'Nunito Sans';
Wick.GUIElement.LAYER_LABEL_FONT_SIZE = 18;
Wick.GUIElement.LAYER_LABEL_ACTIVE_FONT_COLOR = '#40002D';
Wick.GUIElement.LAYER_LABEL_INACTIVE_FONT_COLOR = '#322E2E';
Wick.GUIElement.LAYER_LABEL_FONT_WEIGHT = '600';
Wick.GUIElement.LAYER_LABEL_FONT_FAMILY = 'Nunito Sans';
Wick.GUIElement.LAYER_LABEL_GHOST_COLOR =  Wick.GUIElement.SELECTED_ITEM_BORDER_COLOR;

Wick.GUIElement.LAYER_LABEL_HIDDEN_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 16 16"><path d="M1.5 5.8c-.2-.2-.3-.6 0-.8.8-1.1 3.3-3.7 6.7-3.7S14 3.9 14.9 5c.2.3.2.6 0 .8-1.1.9-3.6 3.2-6.8 3.2S2.4 6.7 1.5 5.8z" fill="none" stroke="#000" stroke-width="1.813"/><path d="M8 8.6c.6 0 1 .4 1 .8v2.5c0 .5-.4.8-1 .8s-1-.4-1-.8V9.5c0-.5.4-.9 1-.9z"/><path d="M10.7 8.1c.5-.2 1.1-.1 1.4.3l1.5 2.1c.3.4.1.9-.4 1.1s-1.1.1-1.4-.3l-1.5-2.1c-.2-.4 0-.9.4-1.1z" fill-rule="evenodd"/><path d="M5.3 8.1c.5.2.6.7.4 1.1l-1.5 2.1c-.3.4-.9.5-1.4.3s-.6-.7-.4-1.1l1.5-2.1c.3-.4.9-.5 1.4-.3z"/></svg>';
Wick.GUIElement.LAYER_LABEL_SHOW_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 16 16"><path d="M1.5 6.7c-.2-.3-.3-.7 0-1 .8-1.3 3.3-4.5 6.7-4.5s5.8 3.2 6.7 4.5a.91.91 0 0 1 0 1c-.9 1.2-3.5 4-6.6 4-3.4 0-5.9-2.8-6.8-4z" fill="none" stroke="#000" stroke-width="2"/><path d="M8.1,8.4c1.4,0,2.5-1.1,2.5-2.5S9.5,3.4,8.1,3.4S5.6,4.6,5.6,5.9S6.7,8.4,8.1,8.4z" fill-rule="evenodd"/></svg>';
Wick.GUIElement.LAYER_GNURL_ICON = '<g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square"><g id="Artboard-Copy-9" transform="translate(0, 0)" stroke="#00AA6B" stroke-width="2"><g id="Group-3" transform="translate(163.000000, 1116.000000)"><g id="Group-16"><g id="Group-13" transform="translate(158.000000, 10.000000)"><path d="M0.1875,1.5 L8.8125,1.5" id="Line-4"></path><path d="M0.1875,5.5 L8.8125,5.5" id="Line-4-Copy"></path><path d="M0.1875,9.5 L8.8125,9.5" id="Line-4-Copy-2"></path></g></g></g></g></g>';
Wick.GUIElement.ADD_TWEEN_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.3 15.3c-.4 0-.8-.2-1.1-.4L1.6 9.3c-.6-.6-.6-1.5 0-2.1l5.6-5.6c.3-.3.7-.4 1.1-.4s.8.2 1.1.4L15 7.2c.6.6.6 1.5 0 2.1l-5.6 5.6c-.4.3-.7.4-1.1.4z" fill="#fff"/><path d="M8.3 2.1c.1 0 .3 0 .4.2l5.6 5.6a.61.61 0 0 1 0 .8l-5.6 5.6a.76.76 0 0 1-.4.2c-.1 0-.3 0-.4-.2L2.3 8.7c-.3-.3-.3-.6 0-.9l5.6-5.6c.1-.1.2-.1.4-.1m0-1.8C7.6.3 7 .5 6.5 1L1 6.5C0 7.5 0 9 1 10l5.6 5.6c.4.4 1 .7 1.7.7s1.2-.3 1.7-.8l5.6-5.6c.9-.9.9-2.5 0-3.4L10 1A2.34 2.34 0 0 0 8.3.3z"/></svg>'
Wick.GUIElement.LAYER_LABEL_LOCK_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 14 16"><path d="M8.3 6.5v6.7H1.6V6.5h6.7M6.9 0H3.1c-1 0-1.7.7-1.7 1.6V5h1.7V1.6h3.7V5H.6c-.4 0-.6.2-.6.6v8.7c0 .3.2.6.7.6h8.7c.3 0 .7-.2.7-.7V5.6c-.2-.4-.4-.6-.8-.6h-1V1.6C8.3.7 7.7.1 6.9 0z" opacity=".9"/><circle cx="5" cy="9.9" r="1.5" opacity=".9"/></svg>';
Wick.GUIElement.LAYER_LABEL_UNLOCK_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 14 16"><path d="M8.3 6.5v6.7H1.6V6.5h6.7M6.9 0H3.1c-1 0-1.7.7-1.7 1.6V5h1.7V1.6h3.7V5H.6c-.4 0-.6.2-.6.6v8.7c0 .3.2.6.7.6h8.7c.3 0 .7-.2.7-.7V5.6c-.2-.4-.4-.6-.8-.6h-1V1.6C8.3.7 7.7.1 6.9 0z" opacity=".9"/></svg>';
Wick.GUIElement.TIMELINE_COPY_FORWARD_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.7 18.8"><g fill="none" stroke="#979797" stroke-width="1.656"><path d="M15.8.9H5.3A1.11 1.11 0 0 0 4.2 2v3.3h8.3a1.11 1.11 0 0 1 1.1 1.1v7.2h2.2a1.11 1.11 0 0 0 1.1-1.1V2A1.11 1.11 0 0 0 15.8.9z"/><path d="M2,5.3h10.5c0.6,0,1.1,0.5,1.1,1.1v10.5c0,0.6-0.5,1.1-1.1,1.1H2 c-0.6,0-1.1-0.5-1.1-1.1V6.4C0.9,5.8,1.4,5.3,2,5.3z"/></g><path d="M10.3 11.1c.1.1.1.2.1.3s0 .2-.1.3-.2.1-.3.1H7.6v2.4c0 .1 0 .2-.1.3s-.2.1-.3.1-.2 0-.3-.1-.1-.2-.1-.3v-2.4H4.4c-.1 0-.2 0-.3-.1s-.1-.2-.1-.3 0-.2.1-.3c.1 0 .2-.1.3-.1h2.4V8.6c0-.1 0-.2.1-.3s.2-.1.3-.1.2 0 .3.1.1.2.1.3V11H10c.1 0 .2.1.3.1z" fill="#979797"/></svg>';
Wick.GUIElement.TIMELINE_DELETE_BUTTON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 22.2" fill="#979797"><path d="M9 17.5a.65.65 0 0 0 .6-.6v-6.1a.65.65 0 0 0-.6-.6.65.65 0 0 0-.6.6V17c0 .3.3.5.6.5zM10.7 0H7.3c-1.1 0-2 .9-2 2v.2H1.5C.7 2.1 0 2.8 0 3.7v2.6a1.54 1.54 0 0 0 1.5 1.5h.2v12c0 1.4 1.1 2.5 2.5 2.5h9.6c1.4 0 2.5-1.1 2.5-2.5v-12h.2A1.54 1.54 0 0 0 18 6.3V3.7a1.54 1.54 0 0 0-1.5-1.5h-3.7V2c-.1-1.1-1-2-2.1-2zM6.4 2c0-.5.4-.8.9-.8h3.5c.5 0 .9.4.9.8v.2H6.4V2zm8.7 17.7c0 .7-.6 1.3-1.3 1.3H4.2c-.7 0-1.3-.6-1.3-1.3v-12h12.3l-.1 12zm1.8-13.5c0 .2-.2.4-.4.4h-15c-.2 0-.4-.2-.4-.4V3.6c0-.2.2-.4.4-.4h15c.2 0 .4.2.4.4v2.6zM5.7 17.5a.65.65 0 0 0 .6-.6v-6.1a.65.65 0 0 0-.6-.6.65.65 0 0 0-.6.6V17c.1.3.3.5.6.5zm6.6 0a.65.65 0 0 0 .6-.6v-6.1a.65.65 0 0 0-.6-.6.65.65 0 0 0-.6.6V17c0 .3.3.5.6.5z"/></svg>';
Wick.GUIElement.LAYER_BUTTON_ICON_COLOR = '#000000';
Wick.GUIElement.LAYER_BUTTON_ICON_RADIUS = 10;
Wick.GUIElement.LAYER_BUTTON_ICON_OPACITY = 0.3;
Wick.GUIElement.LAYER_BUTTON_HOVER_COLOR = '#00ADEF';
Wick.GUIElement.LAYER_BUTTON_MOUSEDOWN_COLOR = '#0198D1';
Wick.GUIElement.LAYER_BUTTON_TOGGLE_ACTIVE_COLOR = 'rgba(255,255,255,0.7)';
Wick.GUIElement.LAYER_BUTTON_TOGGLE_INACTIVE_COLOR = 'rgba(255,255,255,0.01)';

Wick.GUIElement.ACTION_BUTTON_HOVER_COLOR = '#979797';
Wick.GUIElement.ACTION_BUTTON_COLOR = '#000000';
Wick.GUIElement.ACTION_BUTTON_RADIUS = 14;

Wick.GUIElement.SCROLLBAR_BACKGROUND_COLOR = '#191919';
Wick.GUIElement.SCROLLBAR_FILL_COLOR = '#B7B7B7';
Wick.GUIElement.SCROLLBAR_ACTIVE_FILL_COLOR = '#cccccc';
Wick.GUIElement.SCROLLBAR_SIZE = 18;
Wick.GUIElement.SCROLLBAR_MARGIN = 3;
Wick.GUIElement.SCROLLBAR_BORDER_RADIUS = 6;
