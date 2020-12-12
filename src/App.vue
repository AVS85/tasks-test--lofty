<template>
  <v-app>
    <v-app-bar app color="primary" dark>

      <v-btn @click="editItem()" text>
          <v-icon>mdi-plus</v-icon>
          <span class="mr-2">Добавить новый товар</span>
      </v-btn>
 
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark class="mb-2"
        v-bind="attrs"
        v-on="on">
        New Item 
        </v-btn>
      </template>
      
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <template>
              <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details></v-text-field>

              <v-data-table
              :headers="headers"
              :items="GET_PRODUCTS"
              :items-per-page="15"
              :search="search"
              class="elevation-1">


                <template v-slot:item.weight="{ item }">
                  {{ digitGrade(item.weight) }}
                </template>
                <template v-slot:item.price="{ item }">
                  {{ digitGrade(item.price) }}
                </template>
                <template v-slot:item.stock="{ item }">
                  {{ digitGrade(item.stock) }}
                </template>

                <template v-slot:item.actions = "{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteItem(item)" >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
 
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="500px" >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark class="mb-2"
          v-bind="attrs"
          v-on="on"> New Item </v-btn>
      </template> -->

      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                :rules="ruleIsNumInteger"
                v-model="editedItem.artnumber" label="Артикул" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                :rules="ruleRequired"
                v-model="editedItem.name" label="Название" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field 
                v-model="editedItem.brand" label="Бренд"
                required>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                :rules="ruleIsNumber"
                v-model="editedItem.weight" label="Вес" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field 
                :rules="ruleIsNumInteger"
                v-model="editedItem.quantity" label="Фасовка" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.price" label="Цена" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                :rules="ruleIsNumInteger"
                v-model="editedItem.stock" label="Наличие" 
                required>
                </v-text-field>
              </v-col>
  
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close" > Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save" > Save </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    search:'',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
 
    },
    defaultItem: {
      artnumber: '',
      name: '', 
      brand: '', 
      weight: '', 
      quantity: '', 
      price: '', 
      stock: '', 
      
    },
    headers: [
      { text: 'Артикул', value: 'artnumber' },
      { text: 'Название', value: 'name' },
      { text: 'Бренд', value: 'brand' },
      { text: 'Вес', value: 'weight' },
      { text: 'Фасовка', value: 'quantity' },
      { text: 'Цена', value: 'price' },
      { text: 'Наличие', value: 'stock' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    ruleRequired: [
      v => !!v || 'Обязательное поле!'
    ],
    ruleIsNumber: [
      v => ( v && !isNaN(v) ) || 'Только число'
    ],
    ruleIsNumInteger: [
      v => ( v && !isNaN(v) && ( v % 1 ) === 0 ) || 'Только целое число'
    ],
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCTS'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  methods: {
    ...mapActions([
      'LOAD_PRODUCTS'
    ]),

    //*вывод с разрядностью 
    digitGrade(num){ return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") },

    addProducts(){
      console.log('addProducts')
    },

    editItem (item) {
      this.editedIndex = this.GET_PRODUCTS.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.GET_PRODUCTS.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
      // console.log(item);
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    deleteItemConfirm () {
      this.GET_PRODUCTS.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    editItem (item) {
      this.editedIndex = this.GET_PRODUCTS.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.GET_PRODUCTS[this.editedIndex], this.editedItem)
      } else {
        this.GET_PRODUCTS.push(this.editedItem)
      }
      this.close()
    },

  },

  mounted(){
    this.LOAD_PRODUCTS()
  }
};
</script>
