import { withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow } from "vue";
import { Transition, defineComponent } from "vue";
import { noop, isDef, extend, truthProp, numericProp, unknownProp, preventDefault, createNamespace, getZIndexStyle } from "../utils/index.mjs";
import { useLazyRender } from "../composables/use-lazy-render.mjs";
const [name, bem] = createNamespace("overlay");
const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object
};
var stdin_default = defineComponent({
  name,
  props: overlayProps,
  setup(props, {
    slots
  }) {
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const preventTouchMove = (event) => {
      preventDefault(event, true);
    };
    const renderOverlay = lazyRender(() => {
      var _a;
      const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }
      return _withDirectives(_createVNode("div", {
        "style": style,
        "class": [bem(), props.className],
        "onTouchmove": props.lockScroll ? preventTouchMove : noop
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[_vShow, props.show]]);
    });
    return () => _createVNode(Transition, {
      "name": "van-fade",
      "appear": true
    }, {
      default: renderOverlay
    });
  }
});
export {
  stdin_default as default
};
