<script>
	export default {
		onLaunch: function() {
			this.$api.get_user({
				user_id: '5fe08853ee98e30001c0e7cc',
			}).then(({data}) => {
				this.$store.dispatch('set_user_info', data)
			})
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "components/gaoyia-parse/parse.css";
</style>
