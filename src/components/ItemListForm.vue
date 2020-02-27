<template>
  <div>
    <b-form @submit="addItem">
      <b-input-group>
        <b-input ref="textInput" type="text"></b-input>
        <b-button variant="primary" type="submit">Add</b-button>
      </b-input-group>
    </b-form>
    <b-list-group
      class="d-flex flex-row flex-wrap"
      v-bind:class="itemList.length > 0 ? 'p-1 mt-3 border' : ''"
    >
      <Item
        v-for="item in itemList"
        v-bind:key="item.id"
        v-bind:data="item.data"
        v-bind:id="item.id"
        v-on:removeItem="removeItem"
        class="m-1"
      >
      </Item>
    </b-list-group>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import log from "../utils/log";
import Item from "./Item.vue";

export default {
  name: "ItemListForm",
  components: {
    Item
  },
  props: ["initialItems"],
  data() {
    return {
      itemList: []
    };
  },
  mounted() {
    log.debug("[ItemListForm.vue] view mounted");

    for (let item of this.initialItems) {
      let newItem = {
        data: item,
        id: uuidv4()
      };
      this.itemList.push(newItem);
    }
  },
  methods: {
    addItem(e) {
      e.preventDefault();
      log.info("[ItemListForm] adding item to list...");

      let data = this.$refs.textInput.$el.value;
      log.debug(`[ItemListForm.vue] form data: ${data}`);

      this.$refs.textInput.$el.value = "";
      let item = {
        data: data,
        id: uuidv4()
      };
      log.debug("[ItemListForm.vue] item created:");
      log.debug(item);

      this.itemList.push(item);
      this.update();
      log.info("[ItemListForm] item added!");
    },
    removeItem(id) {
      log.info("[ItemListForm] removing item from list...");
      this.itemList = this.itemList.filter(i => i.id != id);
      this.update();
      log.info("[ItemListForm] removed!");
    },
    update() {
      log.debug("[ItemListForm.vue] list updated, sending event message");
      this.$emit("listUpdated", this.itemList);
    }
  }
};
</script>

<style scoped></style>
